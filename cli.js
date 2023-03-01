#!/usr/bin/env node
const Bootstrap = require('./app/bootstrap.js');
const Context = require('./app/context.js');
const configs = require('./app/config');

const fs = require('fs');

// ./cloud_sql_proxy -instances=foss-project-metrics:europe-west1:foss-metrics-db=tcp:5432

async function init() {
  var args = process.argv.slice(2);

  // create an execution context
  const context = await new Context(
    args,
    process.cwd(),
    __dirname
  ).initialize();

  if (context.localConfigExists()) {
    const app = new Bootstrap(context);

    console.log('Starting roadblock...');
    console.log(' ✓ roadblock.json found');
    console.log(' ✓ Context and tasks loaded');

    return run(app);
  } else {
    setupDirectory();
  }
}

function setupDirectory() {
  console.log('  ℹ️   Creating roadblock.json configuration file');
  var json = JSON.stringify(configs.minimalConfig, null, 4);
  fs.writeFileSync(this.localConfig, json, 'utf8');

  console.log(
    '  ✅   Default config created - update the configuration and re-run the roadblock command'
  );

  return true;
}

async function run(app) {
  await app.validateScopes();
  app.context.logger.log(' ✓ Github scopes valid');

  // for debugging, inform how many tasks are planned to run
  app.listLoadedTasks();

  // pre-process - setup calendar and orgs
  // these tasks have no org or repo passed to them.
  await app.runTasks('pre');

  // run org level tasks
  await app.runOrganisationTasks();

  // run internal repository level tasks
  await app.runRepositoryTasks('internal');

  // run external repository level tasks
  // await app.runRepositoryTasks(context.tasks.repo, 'external', context, config);

  // Do all post-process / export tasks
  await app.runTasks('post');

  // metrics based tasks when post-proc has completed
  await app.runTasks('metrics');

  console.log('');
  console.log(' ✓ Roadblock processing complete');
}

init();
