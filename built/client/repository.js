"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Repository = void 0;
var base_1 = require("./base");
var Sequelize = require('sequelize');
var mapper = require('object-mapper');
var helper = require('./helper.js');
var Repository = /** @class */ (function (_super) {
    __extends(Repository, _super);
    function Repository(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        _this.schema = {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
            },
            name: Sequelize.STRING,
            owner: Sequelize.STRING,
            description: Sequelize.STRING,
            full_name: Sequelize.STRING,
            language: Sequelize.STRING,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            stars: Sequelize.INTEGER,
            forks: Sequelize.INTEGER,
            size: Sequelize.INTEGER,
            open_issues: Sequelize.INTEGER,
            watchers: Sequelize.INTEGER,
            type: {
                type: Sequelize.STRING,
                defaultValue: 'internal',
            },
            fork: Sequelize.BOOLEAN,
            archived: Sequelize.BOOLEAN,
            disabled: Sequelize.BOOLEAN,
            private: Sequelize.BOOLEAN,
            pages: Sequelize.BOOLEAN,
            pages_public: Sequelize.BOOLEAN,
            visibility: Sequelize.STRING,
            default_branch: Sequelize.STRING,
            readme: Sequelize.TEXT,
            // this is purely used by extensions that which to store an internal org ID to set ownership
            owner_id: Sequelize.STRING(400),
        };
        _this.map = {
            id: 'id',
            name: 'name',
            description: 'description',
            'owner.login': 'owner',
            full_name: 'full_name',
            language: 'language',
            created_at: 'created_at',
            updated_at: 'updated_at',
            forks_count: 'forks',
            size: 'size',
            stargazers_count: 'stars',
            open_issues_count: 'open_issues',
            watchers_count: 'watchers',
            fork: 'fork',
            archived: 'archived',
            disabled: 'disabled',
            private: 'private',
            has_pages: 'pages',
            pages_public: 'pages_public',
            visibility: 'visibility',
            default_branch: 'default_branch',
            readme: 'readme',
            owner_id: 'owner_id',
            organisation_id: 'organisation_id',
        };
        _this.name = 'Repository';
        return _this;
    }
    Repository.prototype.sync = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //this.model.belongsTo(this.dbClient.models.Organisation);
                        this.model.hasMany(this.dbClient.models.Release);
                        this.model.hasMany(this.dbClient.models.Contribution);
                        this.model.hasMany(this.dbClient.models.Commit);
                        this.model.hasMany(this.dbClient.models.PullRequest);
                        this.model.hasMany(this.dbClient.models.Vulnerability);
                        this.model.belongsToMany(this.dbClient.models.Topic, {
                            through: 'RepositoryTopic',
                        });
                        this.model.belongsToMany(this.dbClient.models.Dependency, {
                            through: 'RepositoryDependency',
                            foreignKey: 'repository_id',
                        });
                        this.model.belongsTo(this.dbClient.models.Organisation, {
                            foreignKey: 'organisation_id',
                        });
                        this.model.hasOne(this.dbClient.models.CommunityProfile, {
                            foreignKey: 'repository_id',
                        });
                        return [4 /*yield*/, _super.prototype.sync.call(this, force)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.getAll = function (orgName) {
        return __awaiter(this, void 0, void 0, function () {
            var repos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ghClient.getRepos(orgName)];
                    case 1:
                        repos = _a.sent();
                        return [2 /*return*/, repos];
                }
            });
        });
    };
    Repository.prototype.getRepo = function (orgName, repo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ghClient.getRepo(orgName, repo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Repository.prototype.bulkCreate = function (repos, organisation) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, repos_1, repo, dbrepo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, repos_1 = repos;
                        _a.label = 1;
                    case 1:
                        if (!(_i < repos_1.length)) return [3 /*break*/, 4];
                        repo = repos_1[_i];
                        dbrepo = mapper(repo, this.map);
                        dbrepo.organisation_id = organisation.id;
                        return [4 /*yield*/, this.model.upsert(dbrepo)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Repository;
}(base_1.Base));
exports.Repository = Repository;
