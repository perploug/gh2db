module.exports = async function (context, config) {
  // Get all members in the org and save them
  console.log(` ▼ Calculating metrics`);
  var metricsForAllRepos = await context.client.Metrics.getAll();
  await context.client.Metrics.bulkCreate(metricsForAllRepos);
  return true;
};
