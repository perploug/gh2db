const recurseDependents = require('./recursedependents.js');

async function getDependentPackages(owner, repository) {
  return get(owner, repository, 'PACKAGE');
}

async function getDependentReposotories(owner, repository) {
  return get(owner, repository, 'REPOSITORY');
}

async function get(owner, repository, dependentType = 'REPOSITORY') {
  const limit = 200;

  let entryUrl = `https://github.com/${owner}/${repository}/network/dependents?dependent_type=${dependentType}`;

  return await recurseDependents({
    url: entryUrl,
    owner,
    repository,
    dependentType,
    limit,
  });
}

module.exports = { getDependentPackages, getDependentReposotories };
