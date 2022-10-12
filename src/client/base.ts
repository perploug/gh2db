import { Sequelize } from 'sequelize/types';
import { Op } from 'sequelize';

import helper = require('./helper.js');
import mapper = require('object-mapper');
import { GithubClient } from '../github/GithubClient.js';

export abstract class Base {
  ghClient: GithubClient;
  dbClient: Sequelize;
  name: string;
  schema: any;
  dbConfig: any;
  model: any;
  map: any;

  constructor(githubClient: GithubClient, databaseClient: Sequelize) {
    this.ghClient = githubClient;
    this.dbClient = databaseClient;

    this.dbConfig = {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    };
  }

  // Defines the model and schema in the sequelize singleton
  define() {
    this.model = this.dbClient.define(this.name, this.schema, this.dbConfig);
  }

  // syncs the schema and any of the intertable relations
  async sync(force) {
    await this.model.sync({ force: force });
  }

  // generic repository delete statement
  async destroy(
    id,
    where = {
      where: { [Op.or]: [{ repository_id: id }, { repository_id: null }] },
    }
  ) {
    try {
      if (!id) {
        return await this.model.destroy({ truncate: true });
      } else {
        return await this.model.destroy(where);
      }
    } catch (ex) {
      console.log(this.name + ' truncating failed: ' + ex);
    }
  }

  async bulkCreate(valArray, externalValues) {
    const dbValArray = this.map
      ? helper.mapArray(valArray, this.map, externalValues)
      : valArray;
    await this.model.bulkCreate(dbValArray);
    return dbValArray;
  }

  async saveOrUpdate(value) {
    const dbValue = mapper(value, this.map);
    dbValue.license = dbValue.repository_id;
    await this.model.upsert(dbValue);
    return dbValue;
  }

  async create(value) {
    const dbValue = mapper(value, this.map);
    await this.model.create(dbValue);
    return dbValue;
  }

  getSchema() {
    return this.schema;
  }

  getMapper() {
    return mapper;
  }

  getModel() {
    return this.model;
  }
}
