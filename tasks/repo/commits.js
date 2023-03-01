const util = require('./../../util');

module.exports = {
  target: ['internal', 'external'],
  run: async function (repo, context, config) {
    let since = null;
    if (config.settings && config.settings.maxDays) {
      since = util.getDateXDaysAgo(config.settings.maxDays);
    }
    var commits = await context.client.Commit.getAll(
      repo.owner,
      repo.name,
      since
    );

    await context.client.Commit.destroy(repo.id);
    await context.client.Commit.bulkCreate(commits, { repository_id: repo.id });
    return true;
  },
};
