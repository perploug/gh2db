var util = require('../../util.js');

module.exports = async function (org, context, config) {
  console.log(` ▼ Downloading ${org.login} repositories`);

  // Get all repositories in the org and save them
  var githubRepositories = await context.client.Repository.getAll(org.login);

  // for each member, call the users api to further enrich the data.
  for (let index = 0; index < githubRepositories.length; index++) {
    const repo = githubRepositories[index];
    const readme = await context.github.getReadme(repo.owner.login, repo.name);

    if (readme && readme.content) {
      repo.readme = Buffer.from(readme.content, 'base64').toString('utf-8');
    }

    if (repo.has_pages) {
      const pages = await context.github.getPages(repo.owner.login, repo.name);
      repo.pages_public = pages.public;
    }
  }

  console.log(
    ` ✓ Saving ${githubRepositories.length} ${org.login} repositories`
  );

  await context.client.Repository.bulkCreate(githubRepositories, org);
  return;
};
