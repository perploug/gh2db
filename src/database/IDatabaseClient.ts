import { Sequelize } from 'sequelize';
import { IConfig } from '../app/IConfig';

export interface IDatabaseClient {
  sequelize: Sequelize;
  db(): Promise<Sequelize>;
}
