const deps = require('../client/dependentsscraper/index');

async function meh() {
  var packages = await deps.getDependentReposotories('spotify', 'luigi');
  console.log(packages);
}

meh();
