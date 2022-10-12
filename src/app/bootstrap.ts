import fs = require('fs');
import path = require('path');
import { performance } from 'perf_hooks';
import dottie = require('dottie');

import { IContext } from './IContext';
import { IConfig } from './IConfig';

import { createGithubClient } from '../github/';
import { createDatabaseClient } from '../database';

import { Client } from '../client';

const configs = require('./config');
const taskTypes = ['pre', 'org', 'repo', 'post', 'metrics'];

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var array = this;
    return [].concat.apply(
      [],
      array.map(function (elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  },
});

export class Bootstrap {
  localConfig: string;
  localDir: string;
  roadblockDir: string;
  context: IContext;

  constructor(localDir: string = null, roadblockDir: string = null) {
    if (!roadblockDir) roadblockDir = path.join(__dirname, '..');

    if (!localDir) localDir = process.cwd();

    this.localConfig = localDir + '/roadblock.json';
    this.localDir = localDir;
    this.roadblockDir = roadblockDir;
    this.context = null;
  }

  localConfigExists() {
    return fs.existsSync(this.localConfig);
  }

  config(args = []) {
    if (!this.localConfigExists()) throw 'Roadblock configuration not found';

    const localConfig: IConfig = require(this.localConfig);
    const config: IConfig = { ...configs.defaultConfig, ...localConfig };

    for (const arg of args) {
      var keyval = arg.split('=');
      if (keyval.length > 1) {
        var val = keyval[1];
        if (val.indexOf('[') == 0 || val.indexOf('{') == 0) {
          val = JSON.parse(val.replace(/'/g, '"'));
        }
        dottie.set(config, keyval[0], val);
      }
    }

    return config;
  }

  setupDirectory(): boolean {
    console.log('  ℹ️   Creating roadblock.json configuration file');
    var json = JSON.stringify(configs.minimalConfig, null, 4);
    fs.writeFileSync(this.localConfig, json, 'utf8');

    console.log(
      '  ✅   Default config created - update the configuration and re-run the roadblock command'
    );

    return true;
  }

  async getContext(config, forceRefresh = false) {
    if (!forceRefresh && this.context !== null) return this.context;

    var context: IContext = {
      start: 0,
      github: undefined,
      database: undefined,
      client: undefined,
      exportClient: undefined,
      ui: undefined,
      tasks: undefined,
    };

    context.start = performance.now();

    context.github = createGithubClient(
      config.github.token,
      config.github.url.api
    );

    context.database = await createDatabaseClient(config).db();

    var externalClients = this._getClients().map((x) => {
      return { file: x, obj: require(x) };
    });

    context.client = await Client(
      context.github,
      context.database,
      false,
      externalClients
    );

    context.ui = {};
    context.tasks = {};

    for (const type of taskTypes) {
      context.tasks[type] = this._getTasks(type, config.tasks).map(
        this.loadTask
      );
    }

    return context;
  }

  async validateScopes(context) {
    var scopes = (await context.github.getScopes()).map((x) => x.trim());
    var scopesValid = true;

    if (scopes.indexOf('repo') < 0) {
      console.error(`  ⚠️  OAuth token does not have repo scope access`);
      scopesValid = false;
    }

    if (scopes.indexOf('read:org') < 0) {
      console.error(`  ⚠️  OAuth token does not have read:org scope access`);
      scopesValid = false;
    }

    if (scopes.indexOf('read:user') < 0 && scopes.indexOf('user') < 0) {
      console.error(`  ⚠️  OAuth token does not have read:user scope access`);
      scopesValid = false;
    }

    if (!scopesValid) {
      throw 'Github auth token does not have the correct access scopes configured';
    }
  }

  async runTasks(name, tasks, context, config) {
    if (tasks.length > 0) {
      console.log('');
      console.log(`Running ${tasks.length} ${name} tasks`);

      for (const task of tasks) {
        await task.func(context, config);
        console.log(` ✓ task:${task.alias} complete `);
      }
    }
  }

  listLoadedTasks(context) {
    console.log('');
    console.log(`Tasks loaded:`);
    for (const type of taskTypes) {
      console.log('  - ' + type + ': ' + context.tasks[type].length + ' tasks');
    }
  }

  async runOrganisationTasks(tasks, context, config) {
    if (tasks.length > 0) {
      // fetch all stored organisations to trigger tasks against...
      const orgs = await context.client.Organisation.model.findAll();

      console.log('');
      console.log(
        `Running ${tasks.length} organisation tasks on ${orgs.length} imported github organisations`
      );

      for (const org of orgs) {
        for (const orgTaskFunc of context.tasks.org) {
          var result = await orgTaskFunc.func(org, context, config);
          console.log(` ✓ task:${orgTaskFunc.alias} complete `);
        }
      }
    }
  }

  async runRepositoryTasks(tasks, context, config) {
    if (tasks.length > 0) {
      // Collect all stored repositories to run tasks against
      const repositories = await context.client.Repository.model.findAll({
        where: {
          fork: false,
        },
      });

      if (repositories.length > 0) {
        console.log('');
        console.log(
          `Running ${tasks.length} repository tasks on ${repositories.length} imported github repositories`
        );

        const chunkedRepos = repositories.chunk(5);
        for (const repoTaskFunc of tasks) {
          var task_queue = [];
          var done = 0;
          var repos_count = 0;

          process.stdout.write(` ⧖ task:${repoTaskFunc.alias}: 0% done`);

          for (const repoChunk of chunkedRepos) {
            for (const repository of repoChunk) {
              if (
                !repository.fork &&
                repository.name !== 'linux' &&
                !repository.private
              ) {
                context.externalValuesMap = { repository_id: repository.id };

                // dumb exception
                if (repoTaskFunc.alias === 'dependents') {
                  await repoTaskFunc.func(repository, context, config);
                } else {
                  task_queue.push(
                    repoTaskFunc.func(repository, context, config)
                  );
                }

                repos_count++;
              }
            }

            await Promise.allSettled(task_queue);
            done++;

            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(
              ` ⧖ task:${repoTaskFunc.alias}: ${Math.round(
                (done / chunkedRepos.length) * 100
              )}% done (${repos_count})`
            );
          }

          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(` ✓ task:${repoTaskFunc.alias} complete \n`);
        }
      } else {
        console.log('');
        console.log(' x  No repositories downloaded');
      }
    }
  }

  _getTasks(dir, filter) {
    var tasks = [];
    var globalPath = this.roadblockDir + '/tasks/' + dir + '/';
    var localPath = this.localDir + '/' + dir + '/';

    var allowTask = function (filename) {
      var key = (dir + '/' + filename.replace('.js', '')).toLowerCase();

      if (filter.indexOf(`!${dir}/*`) > -1) return false;
      if (filter.indexOf(`!${key}`) > -1) return false;

      if (
        filter.indexOf('*') > -1 ||
        filter.indexOf(key) > -1 ||
        filter.indexOf(dir + '/*') > -1
      )
        return true;
    };

    if (fs.existsSync(globalPath)) {
      for (const file of fs.readdirSync(globalPath)) {
        if (allowTask(file)) tasks.push(globalPath + file);
      }
    }
    if (fs.existsSync(localPath)) {
      for (const file of fs.readdirSync(localPath)) {
        if (allowTask(file)) tasks.push(localPath + file);
      }
    }

    return tasks;
  }

  loadTask(taskpath) {
    return {
      func: require(taskpath),
      path: taskpath,
      alias: path.parse(taskpath).name,
    };
  }

  _getClients() {
    var tasks = [];
    var localPath = this.localDir + '/client/';

    if (fs.existsSync(localPath)) {
      for (const file of fs
        .readdirSync(localPath)
        .filter((x) => path.extname(x) === '.js')) {
        tasks.push(localPath + file);
      }
    }

    return tasks;
  }
}
