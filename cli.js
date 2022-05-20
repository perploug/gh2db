#!/usr/bin/env node
const Bootstrap = require('./app/bootstrap.js');

var app;

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

async function init() {
  var args = process.argv.slice(2);
  app = new Bootstrap(process.cwd(), __dirname);

  if (app.localConfigExists()) {
    console.log('Starting roadblock...');
    console.log(' ✓ roadblock.json found');
    const config = app.config(args);
    const context = await app.getContext(config);

    console.log(' ✓ Context and tasks loaded');

    return run(config, context);
  } else {
    return await app.setupDirectory();
  }
}

async function run(config, context) {
  await app.validateScopes(context);
  console.log(' ✓ Github scopes valid');
  // pre-process - setup calendar and orgs
  // these tasks have no org or repo passed to them.
  if (context.tasks.pre.length > 0) {
    console.log('');
    console.log(`Running ${context.tasks.pre.length} pre-processing tasks`);

    for (const task of context.tasks.pre) {
      var result = await task.func(context, config);
      console.log(` ✓ task:${task.alias} complete`);
    }
  }

  if (context.tasks.org.length > 0) {
    // fetch all stored organisations to trigger tasks against...
    var orgs = await context.client.Organisation.model.findAll();

    console.log('');
    console.log(
      `Running ${context.tasks.org.length} organisation tasks on ${orgs.length} imported github organisations`
    );

    for (const org of orgs) {
      for (const orgTaskFunc of context.tasks.org) {
        var result = await orgTaskFunc.func(org, context, config);
        console.log(` ✓ task:${orgTaskFunc.alias} complete `);
      }
    }
  }

  if (context.tasks.repo.length > 0) {
    // Collect all stored repositories to run tasks against
    var repositories = await context.client.Repository.model.findAll({
      where: {
        fork: false,
      },
    });

    if (repositories.length > 0) {
      console.log('');
      console.log(
        `Running ${context.tasks.repo.length} repository tasks on ${repositories.length} imported github repositories`
      );

      const chunkedRepos = repositories.chunk(5);

      for (const repoTaskFunc of context.tasks.repo) {
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
                task_queue.push(repoTaskFunc.func(repository, context, config));
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

  // Do all post-process / export tasks

  if (context.tasks.post.length > 0) {
    console.log('');
    console.log(`Running ${context.tasks.post.length} post-processing tasks`);
    for (const task of context.tasks.post) {
      await task.func(context, config);
      console.log(` ✓ task:${task.alias} complete `);
    }
  }

  if (context.tasks.metrics.length > 0) {
    console.log('');
    console.log(
      `Running ${context.tasks.metrics.length} metrics-processing tasks`
    );
    for (const task of context.tasks.metrics) {
      await task.func(context, config);
      console.log(` ✓ task:${task.alias} complete `);
    }
  }

  console.log('');
  console.log(` ✓ Roadblock processing complete`);
}

init();
