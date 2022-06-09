module.exports = async function (repo, context, config) {
  await context.client.CommunityProfile.destroy(repo.id);

  // Community Profile
  var profiles = await context.client.CommunityProfile.getAll(
    repo.owner,
    repo.name,
    repo.default_branch,
    config
  );

  profiles.repository_id = repo.id;
  // profiles.repository_id = 666;

  await context.client.CommunityProfile.create(profiles);

  return true;
};
