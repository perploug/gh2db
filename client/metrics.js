const Base = require('./base.js');
const Sequelize = require('sequelize');
const mapper = require('object-mapper');
const helper = require('./helper.js');

module.exports = class Metrics extends Base {
  constructor(githubClient, databaseClient) {
    super(githubClient, databaseClient);

    // this schema is intended to accumulate metrics over time, so we will not, store under the repository ID
    // but rather a seperate ID and a timestamp 300 projects * 365 days = 110.000 records per year... we should prune this eventually...
    this.schema = {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      // basics - for historic changes in stars/watchers
      stars: Sequelize.INTEGER,
      forks: Sequelize.INTEGER,

      // calculated
      issue_total: Sequelize.INTEGER,
      issue_open: Sequelize.INTEGER,
      issue_stale: Sequelize.INTEGER,
      pr_total: Sequelize.INTEGER,
      pr_open: Sequelize.INTEGER,
      pr_stale: Sequelize.INTEGER,
      vuln_total: Sequelize.INTEGER,
      commit_total: Sequelize.INTEGER,
      commit_recent: Sequelize.INTEGER,
      commit_internal_total: Sequelize.INTEGER,
      commit_internal_recent: Sequelize.INTEGER,

      commit_work: Sequelize.INTEGER,
      commit_nonwork: Sequelize.INTEGER,
      commit_work_recent: Sequelize.INTEGER,
      commit_nonwork_recent: Sequelize.INTEGER,

      committer_internal: Sequelize.INTEGER,
      committer_external: Sequelize.INTEGER,
    };

    this.map = {
      stars: 'stars',
      forks: 'forks',
      issue_total: 'issue_total',
      issue_open: 'issue_open',
      issue_stale: 'issue_stale',
      pr_total: 'pr_total',
      pr_open: 'pr_open',
      pr_stale: 'pr_stale',
      vuln_total: 'vuln_total',
      commit_total: 'commit_total',
      commit_recent: 'commit_recent',
      commit_internal_total: 'commit_internal_total',
      commit_internal_recent: 'commit_internal_recent',

      commit_work: 'commit_work',
      commit_nonwork: 'commit_nonwork',
      commit_work_recent: 'commit_work_recent',
      commit_nonwork_recent: 'commit_nonwork_recent',

      committer_internal: 'committer_internal',
      committer_external: 'committer_external',
      repository_id: 'repository_id',
    };

    this.name = 'Metrics';
  }

  async sync(force) {
    this.model.belongsTo(this.dbClient.models.Repository, {
      foreignKey: 'repository_id',
    });
    await super.sync(force);
  }

  async getAll() {
    const query = `SELECT "Repository".id as repository_id, "Repository".stars, "Repository".forks,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id) as issue_total,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id and "Issue".state = 'open') as issue_open,
    (select count(1) from "Issue" where "Issue".repository_id = "Repository".id and "Issue".state = 'open' and date_part('day', (now() - "Issue".updated_at)) > 180 ) as issue_stale,
    (select count(1) from "PullRequest"  where "PullRequest".repository_id = "Repository".id) as pr_total,
    (select count(1) from "PullRequest" where "PullRequest".repository_id = "Repository".id and "PullRequest".state = 'open') as pr_open,
    (select count(1) from "PullRequest" where "PullRequest".repository_id = "Repository".id and "PullRequest".state = 'open' and date_part('day', (now() - "PullRequest".updated_at)) > 60 ) as pr_stale,
    (select count(1) from "Vulnerability"  where "Vulnerability".repository_id = "Repository".id) as vuln_total,
    (select count(1) from "Commit"  where "Commit".repository_id = "Repository".id) as commit_total,
    (select count(1) from "Commit"  where "Commit".repository_id = "Repository".id and date_part('day', (now() - "Commit".author_date)) < 90) as commit_recent,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id) as commit_internal_total,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and date_part('day', (now() - "Commit".author_date)) < 90) as commit_internal_recent,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and (extract(isodow from "Commit".author_date) > 5 or extract(hour from "Commit".author_date) not between 8 and 17)) as commit_nonwork,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and (extract(isodow from author_date) < 6 and extract(hour from author_date) between 8 and 17)) as commit_work,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and date_part('day', (now() - "Commit".author_date)) < 90 and (extract(isodow from "Commit".author_date) > 5 or extract(hour from "Commit".author_date) not between 8 and 17)) as commit_nonwork_recent,
    (select count(1) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and date_part('day', (now() - "Commit".author_date)) < 90 and (extract(isodow from author_date) < 6 and extract(hour from author_date) between 8 and 17)) as commit_work_recent,
    (select count( DISTINCT author) from "Commit" inner join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and "Member".login is not null) as committer_internal,
    (select count( DISTINCT author) from "Commit" left join "Member" on "Member".id = "Commit".author where "Commit".repository_id = "Repository".id and "Member".login is null) as committer_external
    FROM "Repository" `;

    const repo_metrics = await this.dbClient.query(query, {
      type: this.dbClient.QueryTypes.SELECT,
    });

    return repo_metrics;
  }
};
