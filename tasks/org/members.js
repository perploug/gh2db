var util = require('../../util.js');

module.exports = {
  run: async function (org, context, config) {
    // Get all members in the org and save them
    console.log(` ▼ Downloading ${org.login} members`);
    var membersInOrg = await context.client.Member.getAll(org.login);

    // for each member, call the users api to further enrich the data.
    for (let index = 0; index < membersInOrg.length; index++) {
      const member = membersInOrg[index];
      var user = await context.github.getUser(member.login);
      membersInOrg[index] = { ...member, ...user };
    }

    console.log(` ✓ Saving ${membersInOrg.length} ${org.login} members`);
    await context.client.Member.bulkCreate(membersInOrg, org);

    return;
  },
};
