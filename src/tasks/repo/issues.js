module.exports = async function (repo, context, config) {
  await context.client.Issue.destroy(repo.id);

  var issues = await context.client.Issue.getAll(repo.owner, repo.name);
  await context.client.Issue.bulkCreate(issues, { repository_id: repo.id });

  return true;
};
