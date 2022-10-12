const Sequelize = require('sequelize');
const fs = require('fs');

function _getFileDate() {
  // get the short version of todays date for naming files
  var today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function saveToFile(data, folder, filename) {
  try {
    fs.writeFileSync(
      `${folder}${filename}.json`,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${folder}${filename}-${_getFileDate()}.json`,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    console.log(` ✓ Export to ${filename} done`);
  } catch (ex) {
    console.log(ex);
  }
}

module.exports = class ExportClient {
  constructor(database, config) {
    this.database = database;
    this.config = config;
  }

  async export() {
    // create a repo file listing the 100 most active projects
    var repos = await this.database.models.Repository.findAll({
      limit: 100,
      order: Sequelize.literal('(forks+stars+watchers) DESC')
    });
    repos = repos.map(x => {
      return x.dataValues;
    });

    saveToFile(repos, this.config.storage, 'repositories');

    // export repos + metrics
    const query = `SELECT "Repository".*,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id) as issue_total,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id and "Issue".state = 'open') as issue_open,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id and "Issue".state = 'open' and date_part('day', (now() - "Issue".updated_at)) > 90 ) as issue_stale,
    (select count(1) from "PullRequest"  where "PullRequest".repository_id = "Repository".id) as pr_total,
    (select count(1) from "PullRequest" where "PullRequest".repository_id = "Repository".id and "PullRequest".state = 'open') as pr_open,
    (select count(1) from "PullRequest" where "PullRequest".repository_id = "Repository".id and "PullRequest".state = 'open' and date_part('day', (now() - "PullRequest".updated_at)) > 60 ) as pr_stale,
    (select count(1) from "Vulnerability"  where "Vulnerability".repository_id = "Repository".id) as vuln_total,
    (select count(1) from "Commit"  where "Commit".repository_id = "Repository".id) as commit_total,
    (select count(1) from "Commit"  where "Commit".repository_id = "Repository".id and date_part('day', (now() - "Commit".author_date)) < 90) as commit_recent,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id) as commit_employee_total,
    (select count( DISTINCT author) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id) as committer_internal,
    (select count( DISTINCT author) from "Commit" left join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and "Member".login is null) as committer_external
    FROM "Repository" `;

    const repo_metrics = await this.database.query(query, { type: this.database.QueryTypes.SELECT });
    saveToFile(repo_metrics, this.config.storage, 'metrics');

    // organisation stats
    var orgs = await this.database.models.Organisation.findAll();
    orgs = orgs.map(x => {
      return x.dataValues;
    });
    saveToFile(orgs, this.config.storage, 'organisations');

    // general statistics
    var stats = {};
    stats.stars = await this.database.models.Repository.sum('stars');
    stats.projects = await this.database.models.Repository.count();
    stats.languages = await this.database.models.Repository.count({
      col: 'language',
      distinct: true
    });
    stats.forks = await this.database.models.Repository.sum('forks');
    stats.members = await this.database.models.Member.count();
    stats.contributors = await this.database.models.Contribution.count({
      col: 'user_id',
      distinct: true
    });

    saveToFile(stats, this.config.storage, 'statistics');
  }
};
