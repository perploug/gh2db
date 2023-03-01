var path = require('path');
const fs = require('fs');

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

module.exports = class TaskRunner {
  constructor(context) {
    this.taskTypes = ['pre', 'org', 'repo', 'post', 'metrics'];
    this.tasks = {};
    this.parallelTasks = 5;
    this.context = context;

    for (const type of this.taskTypes) {
      this.tasks[type] = this._getTasks(type, this.context.config.tasks).map(
        this._loadTask
      );
    }
  }

  loadedTasks() {
    const runner = this;

    this.context.logger.log('');
    this.context.logger.log('Tasks loaded:');
    for (const type of runner.taskTypes) {
      this.context.logger.log(
        `  - ${type}: ${runner.tasks[type].length} tasks`
      );
    }
  }

  // provide the runner with a list of organisations,
  // and it will execute all registered org tasks against all provided organisations
  async runTasksOnOrgansations(organisations) {
    const app = this;
    const tasks = app.tasks['org'];

    if (tasks.length > 0) {
      app.context.logger.log('');
      app.context.logger.log(
        `Running ${tasks.length} organisation tasks on ${organisations.length} github organisations`
      );

      for (const org of organisations) {
        app.context.logger.log(`⧖ org:${org.name}`);
        for (const orgTaskFunc of app.tasks.org) {
          await orgTaskFunc.func.run(org, app.context, app.context.config);
          app.context.logger.log(` ✓ task:${orgTaskFunc.alias} complete `);
        }
        app.context.logger.log(`✓ org:${org.name} done`);
        app.context.logger.log('-------');
      }
    }
  }

  // provide the runner with an array of repositories from the db
  // and it will execute all registered repo tasks against all provided repositories
  // by default it will run against all repositories of type 'internal', but can also
  // run against anything external as collected during the org phase
  async runTasksOnRepositories(repositories, target = 'internal') {
    const app = this;
    const tasks = app.tasks['repo'];
    const _tasks = tasks.filter((x) => {
      return !x.target || x.target.includes(target);
    });

    if (repositories.length > 0 && _tasks.length > 0) {
      app.context.logger.log('');
      app.context.logger.log(
        `Running ${_tasks.length} repository tasks 
        on ${repositories.length} ${target} GitHub repositories`
      );

      // we do chunking to run tasks in parallel
      // depending on the different apis, this could be raised / lowered
      const chunkedRepos = repositories.chunk(this.parallelTasks);

      for (const repoTaskFunc of _tasks) {
        var task_queue = [];
        var done = 0;
        var repos_count = 0;

        app.context.logger.status(`task:${repoTaskFunc.alias}: 0% done`, false);

        // process.stdout.write(` ⧖ task:${repoTaskFunc.alias}: 0% done`);

        for (const repoChunk of chunkedRepos) {
          for (const repository of repoChunk) {
            if (!repository.fork && repository.name !== 'linux') {
              app.context.externalValuesMap = {
                repository_id: repository.id,
              };

              // dumb exception
              if (
                repoTaskFunc.alias
                  .toLowerCase()
                  .slice(repoTaskFunc.alias.length - 4) === 'sync'
              ) {
                await repoTaskFunc.func.run(
                  repository,
                  app.context,
                  app.context.config
                );
              } else {
                task_queue.push(
                  repoTaskFunc.func.run(repository, app.context, app.config)
                );
              }

              repos_count++;
            }
          }

          await Promise.allSettled(task_queue);
          done++;

          app.context.logger.status(
            `task:${repoTaskFunc.alias}: ${Math.round(
              (done / chunkedRepos.length) * 100
            )}% done (${repos_count})`
          );
        }

        app.context.logger.status(
          `task:${repoTaskFunc.alias} complete \n`,
          true,
          '✓'
        );
      }
    }
  }

  // run non-context tasks under a specific type alias
  async runTasks(alias) {
    const app = this;
    const tasks = app.tasks[alias];

    if (tasks.length > 0) {
      app.context.logger.log('');
      app.context.logger.log(
        `Running ${tasks.length} ${alias}-processing tasks`
      );

      for (const task of tasks) {
        await task.func.run(app.context, app.context.config);
        app.context.logger.log(` ✓ task:${task.alias} complete `);
      }
    }
  }

  _getTasks(dir, filter) {
    var tasks = [];
    var globalPath = `${this.context.roadblockDir}/tasks/${dir}/`;
    var localPath = `${this.context.localDir}/${dir}/`;

    var allowTask = function (filename) {
      var key = `${dir}/${filename.replace('.js', '')}`.toLowerCase();

      if (filter.indexOf(`!${dir}/*`) > -1) return false;
      if (filter.indexOf(`!${key}`) > -1) return false;

      if (
        filter.indexOf('*') > -1 ||
        filter.indexOf(key) > -1 ||
        filter.indexOf(`${dir}/*`) > -1
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

  _loadTask(taskpath) {
    return {
      func: require(taskpath),
      path: taskpath,
      alias: path.parse(taskpath).name,
    };
  }
};
