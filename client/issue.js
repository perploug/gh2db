const Base = require('./base.js');
const Sequelize = require('sequelize');
const helper = require('./helper.js');

module.exports = class Issue extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      issue_id: Sequelize.BIGINT,
      title: Sequelize.STRING(600),
      state: Sequelize.STRING,
      url: Sequelize.STRING(600),
      assignee_id: Sequelize.BIGINT,
      user_id: Sequelize.BIGINT,
      user_login: Sequelize.STRING(100),
      user_avatar: Sequelize.STRING(200),
      closed_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      comments: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      pull_request: Sequelize.STRING(400),
    };

    this.map = {
      id: 'issue_id',
      title: 'title',
      state: 'state',
      url: 'url',
      'assignee.id': 'assignee_id',
      'user.id': 'user_id',
      'user.login': 'user_login',
      'user.avatar': 'user_avatar',
      closed_at: 'closed_at',
      updated_at: 'updated_at',
      created_at: 'created_at',
      comments: 'comments',
      repository_id: 'repository_id',
      'pull_request.html_url': 'pull_request',
    };

    this.name = 'Issue';
  }

  sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository);
    super.sync(force);
  }

  async getAll(orgName, logger) {
    return await this.ghClient.getIssues(orgName, logger);
  }
};
