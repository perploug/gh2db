const ghrequestor = require('ghrequestor');
const graphql = require('@octokit/graphql');

module.exports = class GithubClient {
  constructor(token, baseUrl = 'https://api.github.com') {
    this.token = token;
    this.url = baseUrl;

    this.api = {
      organisations: `${this.url}/organizations`,
      userOrganisations: `${this.url}/user/orgs`,
      organisation: (org) => {
        return `${this.url}/orgs/${org}`;
      },

      rateLimit: () => {
        return `${this.url}/rate_limit`;
      },

      repositories: (org) => {
        return `${this.url}/orgs/${org}/repos?type=all`;
      },

      repository: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}`;
      },

      pullRequests: (owner, repo, state = 'all') => {
        return `${this.url}/repos/${owner}/${repo}/pulls?state=${state}`;
      },

      commits: (owner, repo) => {
        return `${this.url}/repos/${owner}/${repo}/commits`;
      },

      issues: (org, filter = 'all', state = 'all') => {
        return `${this.url}/orgs/${org}/issues?filter=${filter}&state=${state}`;
      },
      issuesForRepo: (org, repo, state = 'all') => {
        return `${this.url}/repos/${org}/${repo}/issues?state=${state}`;
      },
      members: (org) => {
        return `${this.url}/orgs/${org}/members`;
      },
      communityProfile: (owner, name) => {
        return `${this.url}/repos/${owner}/${name}/community/profile`;
      },
      webhooks: (owner, name) => {
        return `${this.url}/repos/${owner}/${name}/hooks`;
      },
      branchProtection: (owner, name, branch = 'master') => {
        return `${this.url}/repos/${owner}/${name}/branches/${branch}/protection`;
      },
      externalCollaboratorsForOrg: (org) => {
        return `${this.url}/orgs/${org}/outside_collaborators`;
      },
      collaborators: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/collaborators`;
      },
      contributorStatsForRepo: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/stats/contributors`;
      },
      contributorsForRepo: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/contributors`;
      },

      topicsForRepo: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/topics`;
      },

      releasesForRepo: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/releases`;
      },

      readmeForRepo: (org, repo) => {
        return `${this.url}/repos/${org}/${repo}/readme`;
      },

      memberEvents: (member) => {
        return `${this.url}/users/${member}/events/public`;
      },

      memberRepositories: (member) => {
        return `${this.url}/users/${member}/repos?type=owner`;
      },

      fileContents: (org, repo, path) => {
        return `${this.url}/repos/${org}/${repo}/contents/${path}`;
      },

      listFiles: (org, repo, path) => {
        return `${this.url}/repos/${org}/${repo}/contents/${path}`;
      },

      user: (user) => {
        return `${this.url}/users/${user}`;
      },
    };

    this.headers = { authorization: `token ${token}` };
    this.requestorTemplate = ghrequestor.defaults({
      headers: this.headers,
      logger: this.logger(),
    });

    this.previewHeaders = {
      ...this.headers,
      accept: 'application/vnd.github.black-panther-preview+json',
    };

    this.requestorTemplatePreview = ghrequestor.defaults({
      headers: this.previewHeaders,
      logger: this.logger(),
    });

    this.requestorTemplateTopicPreview = ghrequestor.defaults({
      headers: {
        ...this.headers,
        accept: 'application/vnd.github.mercy-preview+json',
      },
      logger: this.logger(),
    });
  }

  getRequestorTemplate(accceptHeader, standardHeaders = null) {
    var h = standardHeaders ? standardHeaders : this.headers;

    return ghrequestor.defaults({
      headers: {
        ...h,
        accept: accceptHeader,
      },
      logger: this.logger(),
    });
  }

  getBaseUrl() {
    return this.url;
  }

  async getOrgDetails(org) {
    const response = await this.requestorTemplate.get(
      this.api.organisation(org)
    );
    return response.body;
  }

  async getRepo(org, repo) {
    const response = await this.requestorTemplate.get(
      this.api.repository(org, repo)
    );

    return response.body;
  }

  async getReadme(org, repo) {
    const response = await this.requestorTemplate.get(
      this.api.readmeForRepo(org, repo)
    );

    return response.body;
  }

  async getUser(user) {
    const response = await this.requestorTemplate.get(this.api.user(user));

    return response.body;
  }

  async getFileContents(org, repo, path) {
    const response = await this.requestorTemplate.get(
      this.api.fileContents(org, repo, path)
    );

    return response.body;
  }

  async getFileList(org, repo, path = '/') {
    const response = await this.requestorTemplate.get(
      this.api.listFiles(org, repo, path)
    );

    return response.body;
  }

  async getScopes() {
    const response = await this.requestorTemplate.get(this.api.rateLimit());
    if (response.headers['x-oauth-scopes'])
      return response.headers['x-oauth-scopes'].replace(' ', '').split(',');
    else return [];
  }

  async getVulnerabilityAlerts(org) {
    try {
      var response = await graphql(
        `
          query vulnerBilityAlers($owner: String!) {
            organization(login: $owner) {
              repositories(privacy: PUBLIC, first: 100) {
                edges {
                  node {
                    id
                    vulnerabilityAlerts(last: 20) {
                      edges {
                        node {
                          vulnerableManifestFilename
                          vulnerableManifestPath
                          vulnerableRequirements

                          dismissReason
                          dismissedAt

                          dismisser {
                            login
                          }

                          securityAdvisory {
                            description
                            severity
                            summary
                          }

                          securityVulnerability {
                            vulnerableVersionRange
                            severity
                            package {
                              name
                              ecosystem
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        {
          owner: org,
          headers: {
            authorization: 'token ' + this.token,
            accept: 'application/vnd.github.vixen-preview+json',
          },
        }
      );

      return response.organization.repositories.edges.map((x) => x.node);
    } catch (e) {
      console.log(e);
      return new Error(e);
    }
  }

  async getOrgs() {
    const response = await this.requestorTemplate.get(this.api.organisations);
    return response.body;
  }

  async getOrgsForUser() {
    const response = await this.requestorTemplate.get(
      this.api.userOrganisations
    );
    return response.body;
  }

  async getReposForUser(member) {
    const response = await this.requestorTemplate.get(
      this.api.memberRepositories(member)
    );
    return response.body;
  }

  async getRepos(org) {
    const response = await this.requestorTemplate.getAll(
      this.api.repositories(org)
    );

    return response;
  }

  async getReleases(org, repo) {
    const response = await this.requestorTemplate.getAll(
      this.api.releasesForRepo(org, repo)
    );
    return response;
  }

  async getPullRequests(org, repo) {
    return await this.requestorTemplate.getAll(
      this.api.pullRequests(org, repo)
    );
  }

  async getTopics(org, repo) {
    return await this.requestorTemplateTopicPreview.getAll(
      this.api.topicsForRepo(org, repo)
    );
  }

  async getCommits(org, repo) {
    try {
      var result = await this.requestorTemplate.getAll(
        this.api.commits(org, repo)
      );

      if (result && result.length) {
        return result;
      } else {
        return [];
      }
    } catch (ex) {
      return [];
    }
  }

  async getIssues(org, repo = null) {
    var url = repo ? this.api.issuesForRepo(org, repo) : this.api.issues(org);
    return await this.requestorTemplate.getAll(url);
  }

  async getMembers(org, logger = null) {
    var template = !logger
      ? this.requestorTemplate
      : ghrequestor.defaults({
          headers: this.headers,
          logger: logger,
        });

    return await template.getAll(this.api.members(org));
  }

  async getCommunityProfile(org, repo) {
    try {
      const response = await this.requestorTemplatePreview.get(
        this.api.communityProfile(org, repo)
      );
      return response.body;
    } catch (e) {
      return new Error(e);
    }
  }

  async getHooks(org, repo) {
    const response = await this.requestorTemplate.get(
      this.api.webhooks(org, repo)
    );
    return response.body;
  }

  async getBranchProtection(org, repo, branch = 'master') {
    try {
      var rqt = this.getRequestorTemplate(
        'application/vnd.github.luke-cage-preview+json'
      );

      const response = await rqt.get(
        this.api.branchProtection(org, repo, branch)
      );

      return response.body;
    } catch (e) {
      return new Error(e);
    }
  }

  async getExternalCollaboratorsForOrg(org) {
    try {
      return await this.requestorTemplate.getAll(
        this.api.externalCollaboratorsForOrg(org)
      );
    } catch (e) {
      return new Error(e);
    }
  }

  async getCollaborators(org, repo) {
    try {
      var result = await this.requestorTemplate.getAll(
        this.api.collaborators(org, repo)
      );

      if (result && result.length) {
        return result;
      } else {
        return [];
      }
    } catch (ex) {
      return [];
    }
  }

  async getContributions(org, repo) {
    try {
      var result = await this.requestorTemplate.getAll(
        this.api.contributorsForRepo(org, repo)
      );

      if (result && result.length) {
        return result;
      } else {
        return [];
      }
    } catch (ex) {
      return [];
    }
  }

  async getContributionStats(org, repo) {
    return await this.requestorTemplate.getAll(
      this.api.contributorStatsForRepo(org, repo)
    );
  }

  async getExternalContributions(org, repo) {
    try {
      return await this.requestorTemplate.getAll(
        this.api.contributorsForRepo(org, repo)
      );
    } catch (e) {
      return new Error(e);
    }
  }

  logger({ log = null } = {}) {
    const result = {};

    if (log) {
      result.log = log;
    } else {
      result.log = (level, message, data) => {
        if (data && data.statusCode === 204) {
          console.error(
            `\n\n  ⚠️   Github Error: ${data.statusCode} \n 
      ${data.target} \n
      ${data.message} \n\n`
          );
        }

        if (level === 'error') {
          console.error(
            `\n\n  ⚠️   Github Error: ${data.statusCode} \n 
      ${data.target} \n
      ${data.message} \n\n`
          );
        }
      };
    }

    return result;
  }
};
