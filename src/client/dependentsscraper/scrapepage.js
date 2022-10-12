const cheerio = require('cheerio');

function scrapePage(response, { owner, repository, dependentType }) {
  let $ = cheerio.load(response);
  const $dependants = $('#dependents');

  const totalDependants = parseInt(
    $dependants
      .find(
        `[href='/${owner}/${repository}/network/dependents?dependent_type=REPOSITORY']`
      )
      .text()
      .trim()
      .replace(/,/g, '')
      .match('[0-9]*')[0],
    10
  );

  const totalPackages = parseInt(
    $dependants
      .find(
        `[href='/${owner}/${repository}/network/dependents?dependent_type=PACKAGE']`
      )
      .text()
      .trim()
      .replace(/,/g, '')
      .match('[0-9]*')[0],
    10
  );

  /*
  const previousPageUrl =
    $dependants
      .find(
        `[href^='https://github.com/${owner}/${repository}/network/dependents?dependent_type=${dependentType}&dependents_before']`
      )
      .attr('href') ||
    '' ||
    null; */

  const nextPageUrl =
    $dependants
      .find(
        `[href^='https://github.com/${owner}/${repository}/network/dependents?dependent_type=${dependentType}&dependents_after']`
      )
      .attr('href') ||
    '' ||
    null;

  const $entries = $dependants.find('.Box-row');
  let entries = $entries
    .map((index, entry) => {
      let $entry = $(entry);
      let isGhost = $entry.find('[alt="@ghost"]').length > 0;

      // we actually don't want ghosts...
      if (!isGhost) {
        let org = $entry.find('[href]:not([class])').text().trim();
        let repo = $entry.find('[href].text-bold').text().trim();
        let stars = parseInt(
          $entry.find('.octicon-star').parent().text().trim(),
          10
        );
        let forks = parseInt(
          $entry.find('.octicon-repo-forked').parent().text().trim(),
          10
        );

        return {
          org,
          repo,
          stars,
          forks,
          type: dependentType,
        };
      }

      return null;
    })
    .get();

  entries = entries.filter((x) => x !== null);
  const entriesOnPage = entries.length;

  return {
    entriesOnPage,
    totalDependants,
    totalPackages,
    nextPageUrl,
    entries,
  };
}

module.exports = scrapePage;
