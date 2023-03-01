const Base = require('./base.js');
const Sequelize = require('sequelize');

const mapper = require('object-mapper');
const { BIGINT } = require('sequelize');
const { delay } = require('../util.js');

module.exports = class Dependency extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      name: Sequelize.STRING(300),
      manifest: Sequelize.STRING(300),
      manager: Sequelize.STRING(20),
      version: Sequelize.STRING(300),
    };

    this.map = {
      manifest: 'manifest',
      manager: 'manager',
      name: 'name',
      version: 'version',
    };

    this.name = 'Dependency';
  }

  async sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    await super.sync(force);
  }

  async getAll(org, repo) {
    // key / dep
    const graph = await this.ghClient.getDependencyGraph(org, repo);

    const returnVal = [];

    try {
      for (const file of graph) {
        for (const dep of file.node.dependencies.nodes) {
          returnVal.push({
            name: dep.packageName,
            version: dep.requirements,
            manager: dep.packageManager,
            manifest: file.node.blobPath,
          });
        }
      }
    } catch (ex) {
      console.log(ex);
    }

    return returnVal;
  }

  async saveOrUpdate(dependency, repository) {
    const dbDep = mapper(dependency, this.map);
    dbDep.repository_id = repository.id;

    try {
      await this.model.create(dbDep);
    } catch (ex) {
      console.log(ex);
    }
  }

  async bulkCreate(dependencies, repository) {
    for (const dep of dependencies) {
      await this.saveOrUpdate(dep, repository);
    }
  }
};
