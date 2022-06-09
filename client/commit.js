const Base = require('./base.js');
const Sequelize = require('sequelize');
const helper = require('./helper.js');

module.exports = class Commit extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      author: Sequelize.BIGINT,
      author_date: Sequelize.DATE,
      committer: Sequelize.BIGINT,
      committer_login: Sequelize.STRING(100),
      committer_avatar: Sequelize.STRING(200),
      committer_date: Sequelize.DATE,
      url: Sequelize.STRING,
      message: Sequelize.TEXT,
      comment_count: Sequelize.INTEGER,
    };

    this.map = {
      id: 'id',
      'commit.message': 'message',
      'author.id': 'author',
      'commit.author.date': 'author_date',
      'committer.id': 'committer',
      'committer.login': 'committer_login',
      'committer.avatar': 'committer_avatar',
      'commit.committer.date': 'committer_date',
      html_url: 'url',
      'commit.comment_count': 'comment_count',
    };

    this.name = 'Commit';
  }

  sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    super.sync(force);
  }

  async getAll(orgName, repoName) {
    return await this.ghClient.getCommits(orgName, repoName);
  }
};
