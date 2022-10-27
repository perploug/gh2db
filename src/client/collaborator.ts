import { Base } from './base';
const Sequelize = require('sequelize');
const helper = require('./helper.js');

export class Collaborator extends Base {
  name = 'Collaborator';
  schema = {
    user_id: Sequelize.BIGINT,
    avatar: Sequelize.STRING(400),
    login: Sequelize.STRING(100),
    url: Sequelize.STRING,
    pull: Sequelize.BOOLEAN,
    push: Sequelize.BOOLEAN,
    admin: Sequelize.BOOLEAN,
  };
  map = {
    id: 'user_id',
    avatar_url: 'avatar',
    html_url: 'url',
    login: 'login',
    'permissions.push': 'push',
    'permissions.pull': 'pull',
    'permissions.admin': 'admin',
  };

  async sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    await super.sync(force);
  }

  async getAll(orgName, repoName) {
    return await this.ghClient.getCollaborators(orgName, repoName);
  }
}
