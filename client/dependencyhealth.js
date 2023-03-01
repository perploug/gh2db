const Base = require('./base.js');
const Sequelize = require('sequelize');
const { BIGINT } = require('sequelize');

module.exports = class DependencyHealth extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      name: Sequelize.STRING(300),
      manager: Sequelize.STRING(20),
      license: Sequelize.STRING(50),
      repository_url: Sequelize.STRING(300),
      language: Sequelize.STRING(20),
      contributors: BIGINT,
      popularity: BIGINT,
      security: BIGINT,
      popularity: BIGINT,
    };

    this.name = 'DependencyHealth';
  }

  async sync(force) {
    await super.sync(true);
  }
};
