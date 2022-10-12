var GithubClient = require('./github/client.js');
var DatabaseClient = require('./database/client.js');
var Client = require('./client');
var ExportClient = require('./export/client.js');
var Utilities = require('./util.js');
var Bootstrap = require('./app/bootstrap.js');
// Basic export to expose the available libraries, if there is ever a need
// to access these from code rather then through the CLI and the plugin loader
module.exports = {
    Bootstrap: Bootstrap,
    GithubClient: GithubClient,
    DatabaseClient: DatabaseClient,
    Client: Client,
    ExportClient: ExportClient
};
