const Base = require('./base.js');
const Sequelize = require('sequelize');
const mapper = require('object-mapper');
const helper = require('./helper.js');

module.exports = class Member extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      avatar: Sequelize.STRING(400),
      login: Sequelize.STRING(100),
      url: Sequelize.STRING,

      name: Sequelize.STRING(400),
      email: Sequelize.STRING(400),
      company: Sequelize.STRING(400),
      location: Sequelize.STRING(400),
      bio: Sequelize.TEXT,

      employee_id: Sequelize.BIGINT,
      employee_login: Sequelize.STRING,
      employee_title: Sequelize.STRING,
      department: Sequelize.STRING,
      team: Sequelize.STRING,
    };

    this.map = {
      id: 'id',
      avatar_url: 'avatar',
      html_url: 'url',
      login: 'login',

      name: 'name',
      email: 'email',
      company: 'company',
      location: 'location',
      bio: 'bio',
    };

    // this is still fairly lowlevel - if you need to instatiate this,
    // the org client needs to be loaded
    // first, otherwise this will fail
    this.name = 'Member';
  }

  sync(force) {
    this.model.belongsToMany(this.dbClient.models.Organisation, {
      through: 'MemberOrganisation',
    });

    super.sync(force);
  }

  async getAll(orgName, logger) {
    try {
      return await this.ghClient.getMembers(orgName, logger);
    } catch (ex) {
      console.error(ex);
    }

    return [];
  }

  async saveOrUpdate(member, organisation) {
    const dbMember = mapper(member, this.map);

    await this.model
      .findOrCreate({
        where: { id: dbMember.id },
        defaults: dbMember,
      })
      .spread((createdMember) => {
        return organisation.addMember(createdMember);
      });
  }

  async bulkCreate(members, organisation) {
    for (const member of members) {
      await this.saveOrUpdate(member, organisation);
    }
  }
};
