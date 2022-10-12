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
var Base = require('./base.js');
var Sequelize = require('sequelize');
var mapper = require('object-mapper');
var helper = require('./helper.js');
module.exports = /** @class */ (function (_super) {
    __extends(Metrics, _super);
    function Metrics(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        // this schema is intended to accumulate metrics over time, so we will not, store under the repository ID
        // but rather a seperate ID and a timestamp 300 projects * 365 days = 110.000 records per year... we should prune this eventually...
        _this.schema = {
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
        _this.map = {
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
        _this.name = 'Metrics';
        return _this;
    }
    Metrics.prototype.sync = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.belongsTo(this.dbClient.models.Repository, {
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
    Metrics.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, repo_metrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT \"Repository\".id as repository_id, \"Repository\".stars, \"Repository\".forks,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id) as issue_total,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id and \"Issue\".state = 'open') as issue_open,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id and \"Issue\".state = 'open' and date_part('day', (now() - \"Issue\".updated_at)) > 180 ) as issue_stale,\n    (select count(1) from \"PullRequest\"  where \"PullRequest\".repository_id = \"Repository\".id) as pr_total,\n    (select count(1) from \"PullRequest\" where \"PullRequest\".repository_id = \"Repository\".id and \"PullRequest\".state = 'open') as pr_open,\n    (select count(1) from \"PullRequest\" where \"PullRequest\".repository_id = \"Repository\".id and \"PullRequest\".state = 'open' and date_part('day', (now() - \"PullRequest\".updated_at)) > 60 ) as pr_stale,\n    (select count(1) from \"Vulnerability\"  where \"Vulnerability\".repository_id = \"Repository\".id) as vuln_total,\n    (select count(1) from \"Commit\"  where \"Commit\".repository_id = \"Repository\".id) as commit_total,\n    (select count(1) from \"Commit\"  where \"Commit\".repository_id = \"Repository\".id and date_part('day', (now() - \"Commit\".author_date)) < 90) as commit_recent,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id) as commit_internal_total,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and date_part('day', (now() - \"Commit\".author_date)) < 90) as commit_internal_recent,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and (extract(isodow from \"Commit\".author_date) > 5 or extract(hour from \"Commit\".author_date) not between 8 and 17)) as commit_nonwork,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and (extract(isodow from author_date) < 6 and extract(hour from author_date) between 8 and 17)) as commit_work,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and date_part('day', (now() - \"Commit\".author_date)) < 90 and (extract(isodow from \"Commit\".author_date) > 5 or extract(hour from \"Commit\".author_date) not between 8 and 17)) as commit_nonwork_recent,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and date_part('day', (now() - \"Commit\".author_date)) < 90 and (extract(isodow from author_date) < 6 and extract(hour from author_date) between 8 and 17)) as commit_work_recent,\n    (select count( DISTINCT author) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and \"Member\".login is not null) as committer_internal,\n    (select count( DISTINCT author) from \"Commit\" left join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and \"Member\".login is null) as committer_external\n    FROM \"Repository\" ";
                        return [4 /*yield*/, this.dbClient.query(query, {
                                type: this.dbClient.QueryTypes.SELECT,
                            })];
                    case 1:
                        repo_metrics = _a.sent();
                        return [2 /*return*/, repo_metrics];
                }
            });
        });
    };
    return Metrics;
}(Base));
