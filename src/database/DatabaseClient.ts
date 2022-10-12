import { Sequelize } from 'sequelize';
import { IConfig } from '../app/IConfig';
import { IDatabaseClient } from './IDatabaseClient';

export class DatabaseClient implements IDatabaseClient {
  sequelize: Sequelize;
  constructor(config: IConfig) {
    this.sequelize = new Sequelize(
      config.db.database,
      config.db.username,
      config.db.password,
      {
        host: config.db.host,
        dialect: config.db.dialect,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        storage: config.db.storage,
        logging: false,
      }
    );
  }

  async db(): Promise<Sequelize> {
    await this.sequelize.authenticate();
    return this.sequelize;
  }
}
