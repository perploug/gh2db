const Base = require('./base.js');
const Sequelize = require('sequelize');
const helper = require('./helper.js');
const LicenseLookup = require('license-lookup');
const fetch = require('node-fetch');

module.exports = class Dependencies extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      org: Sequelize.STRING(100),
      repo: Sequelize.STRING(100),

      name: Sequelize.STRING(300),
      type: Sequelize.STRING(20),

      license: Sequelize.STRING(30),

      popularity: Sequelize.INTEGER,
      contributors: Sequelize.INTEGER,
      security: Sequelize.INTEGER,
    };

    this.map = {
      type: 'type',
      name: 'name',
      repository_id: 'repository_id',
    };

    this.name = 'Dependencies';
  }

  sync(force) {
    this.model.belongsToMany(this.dbClient.models.Repository, {
      through: 'RepositoryDependency',
    });

    super.sync(force);
  }

  async getAll() {
    // key / dep
    const deps = {};

    // dep / repositores
    const dep = { name, type, reposositories: [] };

    // fetch files from each repo
    var repositories = await this.dbClient.models.Repository.model.findAll({
      where: {
        fork: false,
        private: false,
        archived: false,
      },
    });

    var ll = new LicenseLookup();
    var detected_all = [];
    var processed_all = [];
    var lookedUp = {};

    // first we process all manifests to get all dependency keys
    for (const repo of repositories) {
      try {
        // get all files from root
        var files = await this.ghClient.getFileList(
          repo.dataValues.owner,
          repo.dataValues.name
        );

        files = files.filter((x) => x.type === 'file').map((x) => x.path);

        // compare root files with the matchers
        var matchedFiles = ll.matchFilestoManager(files);

        for (const match in matchedFiles) {
          // for each matched manifest, fetch the manifest and feed it to the lookup to extract
          // depenedency names
          var file = await fetch(
            `https://raw.githubusercontent.com/${repo.dataValues.owner}/${repo.dataValues.name}/${repo.dataValues.default_branch}/${match.file}`
          );

          // if we are able to fetch the manifest
          if (file.ok) {
            var manifest = await file.text();

            // parse the manifest with license lookup to extract the dependency names
            // this is a local operation, and should not take long to do per repo...
            var detectedDependencies = await match.manager.detect(manifest);

            /*
            for (const detected of detectedDependencies) {
              // for each dependency, we need to query the manager for more information,
              // we need to consult the local cache first

              detected_app.push({
                ...detected,
                manager: match.manager,
                repo: {
                  org: repo.dataValues.owner,
                  name: repo.dataValues.name,
                  repo_id: repo.dataValues.id,
                },
              });
            }*/
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    }

    // add to one long dictionary so we only look up things once.. (check the lib to see if it already caches.)

    return complete;
  }
};
