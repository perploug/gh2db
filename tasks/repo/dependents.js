module.exports = {
  target: ['internal'],
  run: async function (repo, context, config) {
    await context.client.Dependents.destroy(repo.id);

    var deps = await context.client.Dependents.getAll(
      repo.owner,
      repo.name,
      repo.id
    );

    await context.client.Dependents.bulkCreate(deps);

    return true;
  },
};
