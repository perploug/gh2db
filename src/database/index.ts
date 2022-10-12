import { DatabaseClient } from '..';
import { IConfig } from '../app/IConfig';
import { IDatabaseClient } from './IDatabaseClient';
import { IDatabaseClientCtor } from './IDatabaseClientCtor';

export function createDatabaseClient(config: IConfig): IDatabaseClient {
  return new DatabaseClient(config);
}
