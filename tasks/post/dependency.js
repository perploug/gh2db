module.exports = async function (context, config) {
  await context.client.Dependency.destroy();

  console.log(` ▼ Collecting dependencies`);
  var depsForallRepos = await context.client.Dependency.getAll();

  await context.client.Dependency.bulkCreate(depsForallRepos);
  return true;
};
