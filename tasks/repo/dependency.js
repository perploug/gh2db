module.exports = {
  target: ['internal'],
  run: async function (repo, context, config) {
    await context.client.Dependency.destroy(repo.id);

    var deps = await context.client.Dependency.getAll(repo.owner, repo.name);
    await context.client.Dependency.bulkCreate(deps, repo);

    return true;
  },
};
