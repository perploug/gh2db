import { Sequelize } from 'sequelize/types';

// Classes for handling each type of data from github
import Organisation = require('./organisation.js');
import { Repository } from './repository';
import Member = require('./member.js');
import Collaborator = require('./collaborator.js');
import PullRequest = require('./pullrequest.js');
import Commit = require('./commit.js');
import Contribution = require('./contribution.js');
import Issue = require('./issue.js');
import CommunityProfile = require('./communityprofile.js');
import ExternalContribution = require('./externalcontribution.js');
import Topic = require('./topic.js');
import Release = require('./release.js');
import { Calendar } from './calendar';
import Vulnerability = require('./vulnerability.js');
import Metrics = require('./metrics.js');

import { Base } from './base';
import Dependents = require('./dependents.js');
import Dependency = require('./dependency.js');
import { IClient } from './IClient';
import { GithubClient } from '../github/GithubClient';

export async function Client(
  github: GithubClient,
  database: Sequelize,
  reset = false,
  externalTypes = []
) {
  var s: IClient = {
    ClientBase: undefined,
    Calendar: undefined,
    Organisation: undefined,
    Repository: undefined,
    Member: undefined,
    Collaborator: undefined,
    PullRequest: undefined,
    Commit: undefined,
    Contribution: undefined,
    Dependents: undefined,
    Dependency: undefined,
    Issue: undefined,
    CommunityProfile: undefined,
    ExternalContribution: undefined,
    Topic: undefined,
    Release: undefined,
    Vulnerability: undefined,
    Metrics: undefined,
  };

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
}
