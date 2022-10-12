#!/usr/bin/env node
const Bootstrap = require('./app/bootstrap.js');

var app;

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

  // for debugging, inform how many tasks are planned to run
  app.listLoadedTasks(context);

  // pre-process - setup calendar and orgs
  // these tasks have no org or repo passed to them.
  await app.runTasks('pre-processing', context.tasks.pre, context, config);

  // run org level tasks
  await app.runOrganisationTasks(context.tasks.org, context, config);

  // run repository level tasks
  await app.runRepositoryTasks(context.tasks.repo, context, config);

  // Do all post-process / export tasks
  await app.runTasks('post-processing', context.tasks.post, context, config);

  // metrics based tasks when post-proc has completed
  await app.runTasks(
    'metrics-processing',
    context.tasks.metrics,
    context,
    config
  );

  console.log('');
  console.log(` ✓ Roadblock processing complete`);
}

init();
