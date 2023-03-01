var util = require('../../util.js');

module.exports = {
  run: async function (org, context, config) {
    if (config[org.login]) {
      const repos = config[org.login].repositories;

      if (repos.length > 0) {
        const collectedRepos = [];

        for (const repo of repos) {
          if (repo.owner && repo.name) {
            var gh_repo = await context.client.Repository.getRepo(
              repo.owner,
              repo.name
            );

            if (gh_repo) {
              gh_repo.type = 'external';
              collectedRepos.push(gh_repo);
            }
          }
        }

        await context.client.Repository.bulkCreate(collectedRepos, org);
      }
      return;
    }
  },
};
