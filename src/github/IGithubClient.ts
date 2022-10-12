interface IGithubClient {
  token: any;
  url: string;
  api: {
    organisations: string;
    userOrganisations: string;
    organisation: (org: string) => string;
    rateLimit: () => string;
    repositories: (org: string) => string;
    repository: (org: string, repo: string) => string;
    pullRequests: (owner: string, repo: string, state?: string) => string;
    commits: (owner: string, repo: string) => string;
    issues: (org: string, filter?: string, state?: string) => string;
    issuesForRepo: (org: string, repo: string, state?: string) => string;
    members: (org: any) => string;
    communityProfile: (owner: string, name: string) => string;
    webhooks: (owner: string, name: string) => string;
    branchProtection: (owner: string, name: string, branch?: string) => string;
    externalCollaboratorsForOrg: (org: string) => string;
    collaborators: (org: string, repo: string) => string;
    contributorStatsForRepo: (org: string, repo: string) => string;
    contributorsForRepo: (org: string, repo: string) => string;
    topicsForRepo: (org: any, repo: any) => string;
    releasesForRepo: (org: any, repo: any) => string;
    readmeForRepo: (org: any, repo: any) => string;
    pagesForRepo: (org: any, repo: any) => string;
    memberEvents: (member: any) => string;
    memberRepositories: (member: any) => string;
    fileContents: (org: any, repo: any, path: any) => string;
    listFiles: (org: any, repo: any, path: any) => string;
    user: (user: any) => string;
  };
  headers: { authorization: string };
  requestorTemplate: any;
  previewHeaders: any;
  requestorTemplatePreview: any;
  requestorTemplateTopicPreview: any;
}
