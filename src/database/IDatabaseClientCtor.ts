import { IConfig } from '../app/IConfig';
import { IDatabaseClient } from './IDatabaseClient';

export interface IDatabaseClientCtor {
  new (config: IConfig): IDatabaseClient;
}
