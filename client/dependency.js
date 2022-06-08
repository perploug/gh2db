const Base = require('./base.js');
const Sequelize = require('sequelize');
const helper = require('./helper.js');
const { LicenseLookup } = require('license-lookup');
const fetch = require('node-fetch');
const mapper = require('object-mapper');

module.exports = class Dependency extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      key: Sequelize.STRING(300),
      name: Sequelize.STRING(300),
      type: Sequelize.STRING(20),
    };

    this.map = {
      key: 'key',
      type: 'type',
      name: 'name',
    };

    this.name = 'Dependency';
  }

  sync(force) {
    this.model.belongsToMany(this.dbClient.models.Repository, {
      through: 'RepositoryDependency',
      foreignKey: 'dep_id',
    });

    super.sync(true);
  }

  async getAll() {
    // key / dep
    const deps = {};

    // fetch files from each repo
    var repositories = await this.dbClient.models.Repository.findAll({
      where: {
        fork: false,
        private: false,
        archived: false,
      },
    });

    var ll = new LicenseLookup();
    const found = {};

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
        var matchedFiles = ll.matchFilesToManager(files);

        for (const match of Object.values(matchedFiles)) {
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

            for (const dep of detectedDependencies) {
              const key = match.manager.name + '.' + dep.name;

              if (!found[key]) {
                const rs = [];
                rs.push(repo.id);

                found[key] = {
                  name: dep.name,
                  type: match.manager.name,
                  key: key,
                  repos: rs,
                };
              } else found[key].repos.push(repo.id);
            }
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    }

    // add to one long dictionary so we only look up things once.. (check the lib to see if it already caches.)

    return Object.values(found);
  }

  async saveOrUpdate(dependency, repos) {
    const dbDependency = mapper(dependency, this.map);
    const instance = await this.model.create(dbDependency);

    for (const repo of repos) {
      if (repo > 0) {
        try {
          instance.addRepository(repo);
          //   this.model.addRepository(instance.id, repo);
        } catch (ex) {
          console.log(
            'Could not associate: dep:' + instance.id + ' and repo: ' + repo
          );
        }
      }
    }
  }

  async bulkCreate(dependencies) {
    for (const dep of dependencies) {
      await this.saveOrUpdate(dep, [...new Set(dep.repos)]);
    }
  }
};
