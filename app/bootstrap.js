const TaskRunner = require('../tasks/runner.js');

module.exports = class Bootstrap {
  // bootstrapping requires a runtime context
  constructor(context) {
    this.context = context;
    this.taskRunner = new TaskRunner(this.context);
  }

  async validateScopes() {
    var scopes = (await this.context.github.getScopes()).map((x) => {
      return x.trim();
    });
    var scopesValid = true;

    if (scopes.indexOf('repo') < 0) {
      console.error('  ⚠️  OAuth token does not have repo scope access');
      scopesValid = false;
    }

    if (scopes.indexOf('read:org') < 0) {
      console.error('  ⚠️  OAuth token does not have read:org scope access');
      scopesValid = false;
    }

    if (scopes.indexOf('read:user') < 0 && scopes.indexOf('user') < 0) {
      console.error('  ⚠️  OAuth token does not have read:user scope access');
      scopesValid = false;
    }

    if (!scopesValid) {
      throw 'Github auth token does not have the correct access scopes configured';
    }
  }

  // running no context tasks (pre, post, metrics)
  async runTasks(alias) {
    await this.taskRunner.runTasks(alias);
  }

  listLoadedTasks() {
    this.taskRunner.loadedTasks();
  }

  async runOrganisationTasks() {
    const orgs = await this.context.client.Organisation.model.findAll();
    await this.taskRunner.runTasksOnOrgansations(orgs);

    /*
    const app = this;

    if (tasks.length > 0) {
      // fetch all stored organisations to trigger tasks against...
      const orgs = await app.context.client.Organisation.model.findAll();

      console.log('');
      console.log(
        `Running ${tasks.length} organisation tasks on ${orgs.length} imported github organisations`
      );

      for (const org of orgs) {
        console.log(`⧖ org:${org.name}`);
        for (const orgTaskFunc of app.context.tasks.org) {
          await orgTaskFunc.func.run(org, app.context, app.config);
          console.log(` ✓ task:${orgTaskFunc.alias} complete `);
        }
        console.log(`✓ org:${org.name} done`);
        console.log('-------');
      }
    }*/
  }

  async runRepositoryTasks(target = 'internal') {
    // Collect all stored repositories to run tasks against
    const _repos = await this.context.client.Repository.model.findAll({
      where: {
        type: target,
      },
    });

    await this.taskRunner.runTasksOnRepositories(_repos, target);
  }
};
