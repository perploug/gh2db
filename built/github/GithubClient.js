"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubClient = void 0;
var ghrequestor = require('ghrequestor');
var graphql = require('@octokit/graphql');
var GithubClient = /** @class */ (function () {
    function GithubClient(token, baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'https://api.github.com'; }
        var _this = this;
        this.token = token;
        this.url = baseUrl;
        this.api = {
            organisations: "".concat(this.url, "/organizations"),
            userOrganisations: "".concat(this.url, "/user/orgs"),
            organisation: function (org) {
                return "".concat(_this.url, "/orgs/").concat(org);
            },
            rateLimit: function () {
                return "".concat(_this.url, "/rate_limit");
            },
            repositories: function (org) {
                return "".concat(_this.url, "/orgs/").concat(org, "/repos?type=all");
            },
            repository: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo);
            },
            pullRequests: function (owner, repo, state) {
                if (state === void 0) { state = 'all'; }
                return "".concat(_this.url, "/repos/").concat(owner, "/").concat(repo, "/pulls?state=").concat(state);
            },
            commits: function (owner, repo) {
                return "".concat(_this.url, "/repos/").concat(owner, "/").concat(repo, "/commits");
            },
            issues: function (org, filter, state) {
                if (filter === void 0) { filter = 'all'; }
                if (state === void 0) { state = 'all'; }
                return "".concat(_this.url, "/orgs/").concat(org, "/issues?filter=").concat(filter, "&state=").concat(state);
            },
            issuesForRepo: function (org, repo, state) {
                if (state === void 0) { state = 'all'; }
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/issues?state=").concat(state);
            },
            members: function (org) {
                return "".concat(_this.url, "/orgs/").concat(org, "/members");
            },
            communityProfile: function (owner, name) {
                return "".concat(_this.url, "/repos/").concat(owner, "/").concat(name, "/community/profile");
            },
            webhooks: function (owner, name) {
                return "".concat(_this.url, "/repos/").concat(owner, "/").concat(name, "/hooks");
            },
            branchProtection: function (owner, name, branch) {
                if (branch === void 0) { branch = 'master'; }
                return "".concat(_this.url, "/repos/").concat(owner, "/").concat(name, "/branches/").concat(branch, "/protection");
            },
            externalCollaboratorsForOrg: function (org) {
                return "".concat(_this.url, "/orgs/").concat(org, "/outside_collaborators");
            },
            collaborators: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/collaborators");
            },
            contributorStatsForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/stats/contributors");
            },
            contributorsForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/contributors");
            },
            topicsForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/topics");
            },
            releasesForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/releases");
            },
            readmeForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/readme");
            },
            pagesForRepo: function (org, repo) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/pages");
            },
            memberEvents: function (member) {
                return "".concat(_this.url, "/users/").concat(member, "/events/public");
            },
            memberRepositories: function (member) {
                return "".concat(_this.url, "/users/").concat(member, "/repos?type=owner");
            },
            fileContents: function (org, repo, path) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/contents/").concat(path);
            },
            listFiles: function (org, repo, path) {
                return "".concat(_this.url, "/repos/").concat(org, "/").concat(repo, "/contents/").concat(path);
            },
            user: function (user) {
                return "".concat(_this.url, "/users/").concat(user);
            },
        };
        this.headers = { authorization: "token ".concat(token) };
        this.requestorTemplate = ghrequestor.defaults({
            headers: this.headers,
            logger: this.logger(),
        });
        this.previewHeaders = __assign(__assign({}, this.headers), { accept: 'application/vnd.github.black-panther-preview+json' });
        this.requestorTemplatePreview = ghrequestor.defaults({
            headers: this.previewHeaders,
            logger: this.logger(),
        });
        this.requestorTemplateTopicPreview = ghrequestor.defaults({
            headers: __assign(__assign({}, this.headers), { accept: 'application/vnd.github.mercy-preview+json' }),
            logger: this.logger(),
        });
    }
    GithubClient.prototype.getRequestorTemplate = function (accceptHeader, standardHeaders) {
        if (standardHeaders === void 0) { standardHeaders = null; }
        var h = standardHeaders ? standardHeaders : this.headers;
        return ghrequestor.defaults({
            headers: __assign(__assign({}, h), { accept: accceptHeader }),
            logger: this.logger(),
        });
    };
    GithubClient.prototype.getBaseUrl = function () {
        return this.url;
    };
    GithubClient.prototype.getOrgDetails = function (org) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.organisation(org))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getRepo = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.repository(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getReadme = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.readmeForRepo(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getPages = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.pagesForRepo(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.user(user))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getFileContents = function (org, repo, path) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.fileContents(org, repo, path))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getFileList = function (org, repo, path) {
        if (path === void 0) { path = '/'; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.listFiles(org, repo, path))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getScopes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.rateLimit())];
                    case 1:
                        response = _a.sent();
                        if (response.headers['x-oauth-scopes'])
                            return [2 /*return*/, response.headers['x-oauth-scopes'].replace(' ', '').split(',')];
                        else
                            return [2 /*return*/, []];
                        return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getVulnerabilityAlerts = function (org) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, graphql("\n          query vulnerBilityAlers($owner: String!) {\n            organization(login: $owner) {\n              repositories(privacy: PUBLIC, first: 100) {\n                edges {\n                  node {\n                    id\n                    vulnerabilityAlerts(last: 20) {\n                      edges {\n                        node {\n                          vulnerableManifestFilename\n                          vulnerableManifestPath\n                          vulnerableRequirements\n\n                          dismissReason\n                          dismissedAt\n\n                          dismisser {\n                            login\n                          }\n\n                          securityAdvisory {\n                            description\n                            severity\n                            summary\n                          }\n\n                          securityVulnerability {\n                            vulnerableVersionRange\n                            severity\n                            package {\n                              name\n                              ecosystem\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        ", {
                                owner: org,
                                headers: {
                                    authorization: 'token ' + this.token,
                                    accept: 'application/vnd.github.vixen-preview+json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.organization.repositories.edges.map(function (x) { return x.node; })];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, new Error(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getOrgs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.organisations)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getOrgsForUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.userOrganisations)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getReposForUser = function (member) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.memberRepositories(member))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getRepos = function (org) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.getAll(this.api.repositories(org))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    GithubClient.prototype.getReleases = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.getAll(this.api.releasesForRepo(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    GithubClient.prototype.getPullRequests = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.getAll(this.api.pullRequests(org, repo))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GithubClient.prototype.getTopics = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplateTopicPreview.getAll(this.api.topicsForRepo(org, repo))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GithubClient.prototype.getCommits = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplate.getAll(this.api.commits(org, repo))];
                    case 1:
                        result = _a.sent();
                        if (result && result.length) {
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        ex_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getIssues = function (org, repo) {
        if (repo === void 0) { repo = null; }
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = repo ? this.api.issuesForRepo(org, repo) : this.api.issues(org);
                        return [4 /*yield*/, this.requestorTemplate.getAll(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GithubClient.prototype.getMembers = function (org, logger) {
        if (logger === void 0) { logger = null; }
        return __awaiter(this, void 0, void 0, function () {
            var template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = !logger
                            ? this.requestorTemplate
                            : ghrequestor.defaults({
                                headers: this.headers,
                                logger: logger,
                            });
                        return [4 /*yield*/, template.getAll(this.api.members(org))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GithubClient.prototype.getCommunityProfile = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplatePreview.get(this.api.communityProfile(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, new Error(e_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getHooks = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.get(this.api.webhooks(org, repo))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                }
            });
        });
    };
    GithubClient.prototype.getBranchProtection = function (org, repo, branch) {
        if (branch === void 0) { branch = 'master'; }
        return __awaiter(this, void 0, void 0, function () {
            var rqt, response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        rqt = this.getRequestorTemplate('application/vnd.github.luke-cage-preview+json');
                        return [4 /*yield*/, rqt.get(this.api.branchProtection(org, repo, branch))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.body];
                    case 2:
                        e_3 = _a.sent();
                        return [2 /*return*/, new Error(e_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getExternalCollaboratorsForOrg = function (org) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplate.getAll(this.api.externalCollaboratorsForOrg(org))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_4 = _a.sent();
                        return [2 /*return*/, new Error(e_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getCollaborators = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplate.getAll(this.api.collaborators(org, repo))];
                    case 1:
                        result = _a.sent();
                        if (result && result.length) {
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        ex_2 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getContributions = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplate.getAll(this.api.contributorsForRepo(org, repo))];
                    case 1:
                        result = _a.sent();
                        if (result && result.length) {
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        ex_3 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.getContributionStats = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestorTemplate.getAll(this.api.contributorStatsForRepo(org, repo))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GithubClient.prototype.getExternalContributions = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.requestorTemplate.getAll(this.api.contributorsForRepo(org, repo))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_5 = _a.sent();
                        return [2 /*return*/, new Error(e_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubClient.prototype.logger = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.log, log = _c === void 0 ? null : _c;
        var result = { log: undefined };
        if (log) {
            result.log = log;
        }
        else {
            result.log = function (level, message, data) {
                if (data && data.statusCode === 204) {
                    console.error("\n\n  \u26A0\uFE0F   Github Error: ".concat(data.statusCode, " \n \n      ").concat(data.target, " \n\n      ").concat(data.message, " \n\n"));
                }
                if (level === 'error') {
                    console.error("\n\n  \u26A0\uFE0F   Github Error: ".concat(data.statusCode, " \n \n      ").concat(data.target, " \n\n      ").concat(data.message, " \n\n"));
                }
            };
        }
        return result;
    };
    return GithubClient;
}());
exports.GithubClient = GithubClient;
