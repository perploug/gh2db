// Classes for handling each type of data from github
const Organisation = require('./organisation.js');
const Repository = require('./repository.js');
const Member = require('./member.js');
const Collaborator = require('./collaborator.js');
const PullRequest = require('./pullrequest.js');
const Commit = require('./commit.js');
const Contribution = require('./contribution.js');
const Issue = require('./issue.js');
const CommunityProfile = require('./communityprofile.js');
const ExternalContribution = require('./externalcontribution.js');
const Topic = require('./topic.js');
const Release = require('./release.js');
const Calendar = require('./calendar.js');
const Vulnerability = require('./vulnerability.js');
const Metrics = require('./metrics.js');

const Base = require('./base.js');
const Dependents = require('./dependents.js');
const Dependency = require('./dependency.js');
const DependencyHealth = require('./dependencyhealth.js');

module.exports = async function (
  github,
  database,
  reset = false,
  externalTypes = []
) {
  var s = {};

  s.ClientBase = Base;

  //Setup helper calendar table for grouping activity based on months
  s.Calendar = new Calendar(github, database);
  s.Calendar.define();

  // Initialize the clients for each individual github api object
  s.Organisation = new Organisation(github, database);
  s.Organisation.define();

  s.Repository = new Repository(github, database);
  s.Repository.define();

  s.Member = new Member(github, database);
  s.Member.define();

  s.Collaborator = new Collaborator(github, database);
  s.Collaborator.define();

  s.PullRequest = new PullRequest(github, database);
  s.PullRequest.define();

  s.Commit = new Commit(github, database);
  s.Commit.define();

  s.Contribution = new Contribution(github, database);
  s.Contribution.define();

  s.Dependents = new Dependents(github, database);
  s.Dependents.define();

  s.Dependency = new Dependency(github, database);
  s.Dependency.define();

  s.DependencyHealth = new DependencyHealth(github, database);
  s.DependencyHealth.define();

  s.Issue = new Issue(github, database);
  s.Issue.define();

  s.CommunityProfile = new CommunityProfile(github, database);
  s.CommunityProfile.define();

  s.ExternalContribution = new ExternalContribution(github, database);
  s.ExternalContribution.define();

  s.Topic = new Topic(github, database);
  s.Topic.define();

  s.Release = new Release(github, database);
  s.Release.define();

  s.Vulnerability = new Vulnerability(github, database);
  s.Vulnerability.define();

  s.Metrics = new Metrics(github, database);
  s.Metrics.define();

  for (const client of externalTypes) {
    try {
      var cl = new client.obj(github, database);
      s[client.obj.name] = cl;
      s[client.obj.name].define();
    } catch (ex) {
      console.log(client.file + ' - ' + ex);
    }
  }

  // finally sync the database so all schemas are in place
  await s.Calendar.sync(reset);
  await s.Organisation.sync(reset);

  await s.Member.sync(reset);
  await s.Repository.sync(reset);
  await s.Collaborator.sync(reset);
  await s.PullRequest.sync(reset);
  await s.Commit.sync(reset);
  await s.Contribution.sync(reset);
  await s.Dependents.sync(reset);
  await s.Dependency.sync(reset);
  await s.DependencyHealth.sync(reset);

  await s.Issue.sync(reset);
  await s.CommunityProfile.sync(reset);
  await s.ExternalContribution.sync(reset);
  await s.Topic.sync(reset);
  await s.Release.sync(reset);
  await s.Vulnerability.sync(reset);
  await s.Metrics.sync(reset);

  for (const client of externalTypes) {
    try {
      await s[client.obj.name].sync(reset);
    } catch (ex) {}
  }

  await database.sync({ force: reset });
  return s;
};
