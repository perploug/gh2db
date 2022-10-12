module.exports = async function (repo, context, config) {
  await context.client.PullRequest.destroy(repo.id);

  var prs = await context.client.PullRequest.getAll(repo.owner, repo.name);
  await context.client.PullRequest.bulkCreate(prs, { repository_id: repo.id });

  return true;
};
