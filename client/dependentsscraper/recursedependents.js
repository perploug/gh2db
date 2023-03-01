//const getGithubPage = require('./getpage.js');
const scrapePage = require('./scrapepage.js');
const fetch = require('node-fetch');

async function recurseDependents({
  url,
  owner,
  repository,
  dependentType,
  limit,
  entries = [],
}) {
  // fetch the github page containing the graph

  const response = await fetch(url);

  if (!response.ok) {
    return entries;
  }

  // scrape the page with cheerio
  let data = scrapePage(await response.text(), {
    owner,
    repository,
    dependentType,
  });

  // loead the entries
  entries = entries.concat(data.entries);

  // have we collected enough data?
  const hasReachedLimit = entries.length >= limit;

  // if we have reached the limit, we slice it down..
  if (hasReachedLimit) {
    return entries;
  }

  // we might have run out of entries, so we discontinue.
  if (!data.nextPageUrl) {
    return entries;
  }

  entries = await recurseDependents({
    url: data.nextPageUrl,
    owner,
    repository,
    dependentType,
    limit,
    entries,
  });

  return entries;
}

module.exports = recurseDependents;
