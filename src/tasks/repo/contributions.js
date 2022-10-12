module.exports = async function (repo, context, config) {
  await context.client.Contribution.destroy(repo.id);

  var contributions = await context.client.Contribution.getAll(
    repo.owner,
    repo.name
  );

  await context.client.Contribution.bulkCreate(contributions, {
    repository_id: repo.id,
  });

  return true;
};
