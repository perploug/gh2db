import { Sequelize } from 'sequelize/types';
import { GithubClient } from '../github/GithubClient';

export interface IContext {
  start: number;
  github: GithubClient;
  database: Sequelize;
  client: any;
  exportClient: any;
  ui: {};
  tasks: {};
}
