module.exports = async function (repo, context, config) {
  await context.client.Commit.destroy(repo.id);

  var commits = await context.client.Commit.getAll(repo.owner, repo.name);
  await context.client.Commit.bulkCreate(commits, { repository_id: repo.id });
  return true;
};
