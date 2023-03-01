module.exports = {
  run: async function (context) {
    var months = await context.client.Calendar.getAll(2014);
    await context.client.Calendar.destroy(0, { truncate: true });

    await context.client.Calendar.bulkCreate(months);
    return true;
  },
};
