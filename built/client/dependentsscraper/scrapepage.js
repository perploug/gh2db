var cheerio = require('cheerio');
function scrapePage(response, _a) {
    var owner = _a.owner, repository = _a.repository, dependentType = _a.dependentType;
    var $ = cheerio.load(response);
    var $dependants = $('#dependents');
    var totalDependants = parseInt($dependants
        .find("[href='/".concat(owner, "/").concat(repository, "/network/dependents?dependent_type=REPOSITORY']"))
        .text()
        .trim()
        .replace(/,/g, '')
        .match('[0-9]*')[0], 10);
    var totalPackages = parseInt($dependants
        .find("[href='/".concat(owner, "/").concat(repository, "/network/dependents?dependent_type=PACKAGE']"))
        .text()
        .trim()
        .replace(/,/g, '')
        .match('[0-9]*')[0], 10);
    /*
    const previousPageUrl =
      $dependants
        .find(
          `[href^='https://github.com/${owner}/${repository}/network/dependents?dependent_type=${dependentType}&dependents_before']`
        )
        .attr('href') ||
      '' ||
      null; */
    var nextPageUrl = $dependants
        .find("[href^='https://github.com/".concat(owner, "/").concat(repository, "/network/dependents?dependent_type=").concat(dependentType, "&dependents_after']"))
        .attr('href') ||
        '' ||
        null;
    var $entries = $dependants.find('.Box-row');
    var entries = $entries
        .map(function (index, entry) {
        var $entry = $(entry);
        var isGhost = $entry.find('[alt="@ghost"]').length > 0;
        // we actually don't want ghosts...
        if (!isGhost) {
            var org = $entry.find('[href]:not([class])').text().trim();
            var repo = $entry.find('[href].text-bold').text().trim();
            var stars = parseInt($entry.find('.octicon-star').parent().text().trim(), 10);
            var forks = parseInt($entry.find('.octicon-repo-forked').parent().text().trim(), 10);
            return {
                org: org,
                repo: repo,
                stars: stars,
                forks: forks,
                type: dependentType,
            };
        }
        return null;
    })
        .get();
    entries = entries.filter(function (x) { return x !== null; });
    var entriesOnPage = entries.length;
    return {
        entriesOnPage: entriesOnPage,
        totalDependants: totalDependants,
        totalPackages: totalPackages,
        nextPageUrl: nextPageUrl,
        entries: entries,
    };
}
module.exports = scrapePage;
