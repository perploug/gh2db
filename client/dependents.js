const Base = require('./base.js');
const Sequelize = require('sequelize');
const helper = require('./helper.js');
const dependents = require('./dependentsscraper/index');

module.exports = class Dependents extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      type: Sequelize.STRING(100),

      org: Sequelize.STRING(100),
      repo: Sequelize.STRING(100),
      stars: Sequelize.BIGINT,
      forks: Sequelize.BIGINT,

      name: Sequelize.STRING(300),
      email: Sequelize.STRING(300),
      company: Sequelize.STRING(300),
      location: Sequelize.STRING(300),
    };

    this.map = {
      org: 'org',
      repo: 'repo',
      type: 'type',
      repository_id: 'repository_id',
      stars: 'stars',
      forks: 'forks',

      login: 'login',
      name: 'name',
      email: 'email',
      company: 'company',
      location: 'location',
    };

    this.name = 'Dependents';
  }

  sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository);
    super.sync(force);
  }

  async getAll(orgName, repoName, repoId) {
    var packages = await dependents.getDependentPackages(orgName, repoName);
    var repositories = await dependents.getDependentReposotories(
      orgName,
      repoName
    );

    var complete = packages.concat(repositories);
    var members = new Set(complete.map((x) => x.org));

    console.log('    - ' + repoName + ' dependents: ' + complete.length);

    for (const member of members) {
      try {
        var user = await this.ghClient.getUser(member);

        if (user) {
          for (let entry of complete.filter((x) => x.org === member)) {
            entry.company = user.company;
            entry.email = user.email;
            entry.location = user.location;
            entry.name = user.name;
            entry.repository_id = repoId;
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    }

    return complete;
  }
};
