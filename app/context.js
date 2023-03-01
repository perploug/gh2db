const fs = require('fs');
var path = require('path');
const configs = require('./config');
const { performance } = require('perf_hooks');
const dottie = require('dottie');

const GithubClient = require('../github/client.js');
const DatabaseClient = require('../database/client.js');
const Client = require('../client');

// creates an execution context and holds all shared services to access across the different tasks
module.exports = class Context {
  constructor(args = [], localDir = null, roadblockDir = null) {
    if (!roadblockDir) roadblockDir = path.join(__dirname, '..');

    if (!localDir) localDir = process.cwd();

    this.localConfig = `${localDir}/roadblock.json`;
    this.localDir = localDir;
    this.roadblockDir = roadblockDir;

    if (!this.localConfigExists()) throw 'Roadblock configuration not found';

    this.config = this.loadConfig(args);
    this.github = null;
    this.database = null;
    this.client = null;

    // standard console logger
    this.logger = {
      log: function (msg) {
        console.log(msg);
      },
      error: function (msg) {
        console.error(msg);
      },
      status: function (msg, clear = true, prefix = ' ⧖ ') {
        if (clear) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
        }

        process.stdout.write(prefix + msg);
      },
    };
  }

  localConfigExists() {
    return fs.existsSync(this.localConfig);
  }

  loadConfig(args = []) {
    if (!this.localConfigExists()) throw 'Roadblock configuration not found';

    const localConfig = require(this.localConfig);
    const config = { ...configs.defaultConfig, ...localConfig };

    for (const arg of args) {
      var keyval = arg.split('=');
      if (keyval.length > 1) {
        var val = keyval[1];
        if (val.indexOf('[') == 0 || val.indexOf('{') == 0) {
          val = JSON.parse(val.replace(/'/g, '"'));
        }
        dottie.set(config, keyval[0], val);
      }
    }

    return config;
  }

  async initialize() {
    const app = this;
    const config = this.config;

    app.start = performance.now();
    app.github = new GithubClient(config.github.token, config.github.url.api);
    app.database = await new DatabaseClient(config.db).db();
    var externalClients = this._getClients().map((x) => {
      return { file: x, obj: require(x) };
    });

    app.client = await Client(app.github, app.database, false, externalClients);
    return app;
  }

  _getClients() {
    var clients = [];
    var localPath = `${this.localDir}/client/`;

    if (fs.existsSync(localPath)) {
      for (const file of fs.readdirSync(localPath).filter((x) => {
        return path.extname(x) === '.js';
      })) {
        clients.push(localPath + file);
      }
    }

    return clients;
  }
};
