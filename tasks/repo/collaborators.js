module.exports = {
  target: ['internal'],
  run: async function (repo, context, config) {
    await context.client.Collaborator.destroy(repo.id);

    var collaborators = await context.client.Collaborator.getAll(
      repo.owner,
      repo.name
    );

    await context.client.Collaborator.bulkCreate(collaborators, {
      repository_id: repo.id,
    });

    return true;
  },
};
