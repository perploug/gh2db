import { Base } from './base';
const Sequelize = require('sequelize');
const helper = require('./helper.js');

const rp = require('request-promise');
const yaml = require('js-yaml');

export class CommunityProfile extends Base {
  name = 'CommunityProfile';
  schema = {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    health_percentage: Sequelize.INTEGER,
    description: Sequelize.STRING,
    documentation: Sequelize.STRING,
    code_of_conduct: Sequelize.BOOLEAN,
    contributing: Sequelize.BOOLEAN,
    issue_template: Sequelize.BOOLEAN,
    pull_request_template: Sequelize.BOOLEAN,
    readme: Sequelize.BOOLEAN,
    license: Sequelize.STRING,

    required_reviewers: Sequelize.BOOLEAN,
    require_codeowners: Sequelize.BOOLEAN,
    protected_master: Sequelize.BOOLEAN,
    enforce_admins: Sequelize.BOOLEAN,
  };

  map = {
    id: 'id',
    'community.health_percentage': 'health_percentage',
    'community.description': 'description',
    'community.documentation': 'documentation',
    repository_id: 'repository_id',
    'community.files.code_of_conduct': {
      key: 'code_of_conduct',
      transform: (file) => {
        return file ? true : false;
      },
    },
    'community.files.contributing': {
      key: 'contributing',
      transform: (file) => {
        return file ? true : false;
      },
    },
    'community.files.issue_template': {
      key: 'issue_template',
      transform: (file) => {
        return file ? true : false;
      },
    },
    'community.files.pull_request_template': {
      key: 'pull_request_template',
      transform: (file) => {
        return file ? true : false;
      },
    },
    'community.files.readme': {
      key: 'readme',
      transform: (file) => {
        return file ? true : false;
      },
    },
    'community.files.license': {
      key: 'license',
      transform: (file) => {
        return file ? file.name : '';
      },
    },

    'branchProtection.required_pull_request_reviews.required_approving_review_count':
      'required_reviewers',
    'branchProtection.required_pull_request_reviews.require_code_owner_reviews':
      'require_codeowners',
    'branchProtection.enforce_admins.enabled': 'enforce_admins',

    branchProtection: {
      key: 'protected_master',
      transform: (protection) => {
        return protection ? true : false;
      },
    },
  };

  async sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    await super.sync(force);
  }

  async urlExists(url) {
    const options = {
      uri: url,
      resolveWithFullResponse: true,
    };

    try {
      const res = await rp(options);
      return /^(?!4)\d\d/.test(res.statusCode);
    } catch (err) {
      return false;
    }
  }

  async getUrl(url) {
    const options = {
      uri: url,
      resolveWithFullResponse: true,
    };

    try {
      const res = await rp(options);
      return res.body;
    } catch (err) {
      return null;
    }
  }

  async getAll(orgName, repoName, branch, config) {
    try {
      const community = await this.ghClient.getCommunityProfile(
        orgName,
        repoName
      );

      /*
      var branchProtection = await this.ghClient.getBranchProtection(
        orgName,
        repoName,
        branch
      );

      
      files.contributing = await this.urlExists(
        filesBaseUrl + 'CONTRUBUTING.md'
      );

      files.security = await this.urlExists(filesBaseUrl + 'SECURITY.md');

      files.codeowners = await this.urlExists(
        filesBaseUrl + '.github/CODEOWNERS'
      );

      files.maintainers = await this.urlExists(filesBaseUrl + 'MAINTAINERS');
        */

      return { community };
    } catch (ex) {
      return {};
    }
  }
}
