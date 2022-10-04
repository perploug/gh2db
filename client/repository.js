const Base = require('./base.js');
const Sequelize = require('sequelize');
const mapper = require('object-mapper');
const helper = require('./helper.js');

module.exports = class Repository extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      owner: Sequelize.STRING,
      description: Sequelize.STRING,
      full_name: Sequelize.STRING,
      language: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      stars: Sequelize.INTEGER,
      forks: Sequelize.INTEGER,
      size: Sequelize.INTEGER,
      open_issues: Sequelize.INTEGER,
      watchers: Sequelize.INTEGER,

      type: {
        type: Sequelize.STRING,
        defaultValue: 'internal',
      },

      fork: Sequelize.BOOLEAN,
      archived: Sequelize.BOOLEAN,
      disabled: Sequelize.BOOLEAN,
      private: Sequelize.BOOLEAN,
      pages: Sequelize.BOOLEAN,
      pages_public: Sequelize.BOOLEAN,

      visibility: Sequelize.STRING,
      default_branch: Sequelize.STRING,
      readme: Sequelize.TEXT,

      // this is purely used by extensions that which to store an internal org ID to set ownership
      owner_id: Sequelize.STRING(400),
    };

    this.map = {
      id: 'id',
      name: 'name',
      description: 'description',
      'owner.login': 'owner',
      full_name: 'full_name',
      language: 'language',
      created_at: 'created_at',
      updated_at: 'updated_at',
      forks_count: 'forks',
      size: 'size',
      stargazers_count: 'stars',
      open_issues_count: 'open_issues',
      watchers_count: 'watchers',

      fork: 'fork',
      archived: 'archived',
      disabled: 'disabled',
      private: 'private',
      has_pages: 'pages',
      pages_public: 'pages_public',
      visibility: 'visibility',
      default_branch: 'default_branch',
      readme: 'readme',
      owner_id: 'owner_id',
      organisation_id: 'organisation_id',
    };

    this.name = 'Repository';
  }

  async sync(force) {
    //this.model.belongsTo(this.dbClient.models.Organisation);
    this.model.hasMany(this.dbClient.models.Release);
    this.model.hasMany(this.dbClient.models.Contribution);
    this.model.hasMany(this.dbClient.models.Commit);
    this.model.hasMany(this.dbClient.models.PullRequest);
    this.model.hasMany(this.dbClient.models.Vulnerability);

    this.model.belongsToMany(this.dbClient.models.Topic, {
      through: 'RepositoryTopic',
    });

    this.model.belongsToMany(this.dbClient.models.Dependency, {
      through: 'RepositoryDependency',
      foreignKey: 'repository_id',
    });

    this.model.belongsTo(this.dbClient.models.Organisation, {
      foreignKey: 'organisation_id',
    });
    this.model.hasOne(this.dbClient.models.CommunityProfile, {
      foreignKey: 'repository_id',
    });

    await super.sync(force);
  }

  async getAll(orgName) {
    const repos = await this.ghClient.getRepos(orgName);
    return repos;
  }

  async getRepo(orgName, repo) {
    return await this.ghClient.getRepo(orgName, repo);
  }

  async bulkCreate(repos, organisation) {
    for (const repo of repos) {
      const dbrepo = mapper(repo, this.map);
      dbrepo.organisation_id = organisation.id;

      await this.model.upsert(dbrepo);
    }
  }
};
