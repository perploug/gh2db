const util = require('./../../util');

module.exports = {
  target: ['internal', 'external'],
  run: async function (repo, context, config) {
    let since = null;
    if (config.settings && config.settings.maxDays) {
      since = util.getDateXDaysAgo(config.settings.maxDays);
    }
    const prs = await context.client.PullRequest.getAll(
      repo.owner,
      repo.name,
      since
    );

    if (prs && prs.length > 0) {
      await context.client.PullRequest.destroy(repo.id);
      await context.client.PullRequest.bulkCreate(prs, {
        repository_id: repo.id,
      });
    }

    return true;
  },
};
