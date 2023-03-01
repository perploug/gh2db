const util = require('./../../util');

module.exports = {
  target: ['internal'],
  run: async function (repo, context, config) {
    let since = null;
    if (config.settings && config.settings.maxDays) {
      since = util.getDateXDaysAgo(config.settings.maxDays);
    }

    var issues = await context.client.Issue.getAll(
      repo.owner,
      repo.name,
      since
    );

    await context.client.Issue.destroy(repo.id);
    await context.client.Issue.bulkCreate(issues, { repository_id: repo.id });

    return true;
  },
};
