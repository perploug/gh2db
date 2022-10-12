import { Dialect } from 'sequelize/types';

export interface IConfig {
  github: {
    token: string;
    url: {
      git: string;
      api: string;
      raw: string;
    };
  };

  tasks: Array<string>;
  orgs: Array<string>;

  db: {
    database?: string;
    dialect?: Dialect;
    storage?: string;
    host?: string;
    username?: string;
    password?: string;
  };

  export: {
    storage: string;
  };

  externalProjects: Array<string>;
}
