import { Calendar } from './calendar';

export interface IClient {
  ClientBase: any;
  Calendar: Calendar;
  Organisation: any;
  Repository: any;
  Member: any;
  Collaborator: any;
  PullRequest: any;
  Commit: any;
  Contribution: any;
  Dependents: any;
  Dependency: any;
  Issue: any;
  CommunityProfile: any;
  ExternalContribution: any;
  Topic: any;
  Release: any;
  Vulnerability: any;
  Metrics: any;
}
