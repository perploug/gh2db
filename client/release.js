const Base = require('./base.js');
const Sequelize = require('sequelize');

module.exports = class Release extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: Sequelize.STRING(300),
      body: Sequelize.TEXT,
      tag_name: Sequelize.STRING,
      url: Sequelize.STRING,
      created_at: Sequelize.DATE,
      published_at: Sequelize.DATE,
    };

    this.map = {
      id: 'id',
      name: 'name',
      body: 'body',
      tag_name: 'tag_name',
      html_url: 'url',
      created_at: 'created_at',
      published_at: 'published_at',
    };

    this.name = 'Release';
  }

  sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    super.sync(force);
  }

  async getAll(orgName, repoName) {
    return await this.ghClient.getReleases(orgName, repoName);
  }
};
