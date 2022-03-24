module.exports = async function (repo, context, config) {
  await context.client.CommunityProfile.destroy(repo.id);

  // Community Profile
  var profiles = await context.client.CommunityProfile.getAll(
    repo.owner,
    repo.name,
    repo.default_branch,
    config
  );

  await context.client.CommunityProfile.bulkCreate(profiles, {
    repository_id: repo.id,
  });

  return true;
};
