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
var Sequelize = require('sequelize');
var fs = require('fs');
function _getFileDate() {
    // get the short version of todays date for naming files
    var today = new Date();
    return "".concat(today.getFullYear(), "-").concat(today.getMonth() + 1, "-").concat(today.getDate());
}
function saveToFile(data, folder, filename) {
    try {
        fs.writeFileSync("".concat(folder).concat(filename, ".json"), JSON.stringify(data, null, 2), 'utf8');
        fs.writeFileSync("".concat(folder).concat(filename, "-").concat(_getFileDate(), ".json"), JSON.stringify(data, null, 2), 'utf8');
        console.log(" \u2713 Export to ".concat(filename, " done"));
    }
    catch (ex) {
        console.log(ex);
    }
}
module.exports = /** @class */ (function () {
    function ExportClient(database, config) {
        this.database = database;
        this.config = config;
    }
    ExportClient.prototype.export = function () {
        return __awaiter(this, void 0, void 0, function () {
            var repos, query, repo_metrics, orgs, stats, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.database.models.Repository.findAll({
                            limit: 100,
                            order: Sequelize.literal('(forks+stars+watchers) DESC')
                        })];
                    case 1:
                        repos = _g.sent();
                        repos = repos.map(function (x) {
                            return x.dataValues;
                        });
                        saveToFile(repos, this.config.storage, 'repositories');
                        query = "SELECT \"Repository\".*,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id) as issue_total,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id and \"Issue\".state = 'open') as issue_open,\n    (select count(1) from \"Issue\" where \"Issue\".repository_id = \"Repository\".id and \"Issue\".state = 'open' and date_part('day', (now() - \"Issue\".updated_at)) > 90 ) as issue_stale,\n    (select count(1) from \"PullRequest\"  where \"PullRequest\".repository_id = \"Repository\".id) as pr_total,\n    (select count(1) from \"PullRequest\" where \"PullRequest\".repository_id = \"Repository\".id and \"PullRequest\".state = 'open') as pr_open,\n    (select count(1) from \"PullRequest\" where \"PullRequest\".repository_id = \"Repository\".id and \"PullRequest\".state = 'open' and date_part('day', (now() - \"PullRequest\".updated_at)) > 60 ) as pr_stale,\n    (select count(1) from \"Vulnerability\"  where \"Vulnerability\".repository_id = \"Repository\".id) as vuln_total,\n    (select count(1) from \"Commit\"  where \"Commit\".repository_id = \"Repository\".id) as commit_total,\n    (select count(1) from \"Commit\"  where \"Commit\".repository_id = \"Repository\".id and date_part('day', (now() - \"Commit\".author_date)) < 90) as commit_recent,\n    (select count(1) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id) as commit_employee_total,\n    (select count( DISTINCT author) from \"Commit\" inner join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id) as committer_internal,\n    (select count( DISTINCT author) from \"Commit\" left join \"Member\" on \"Member\".id = \"Commit\".author where \"Commit\".repository_id = \"Repository\".id and \"Member\".login is null) as committer_external\n    FROM \"Repository\" ";
                        return [4 /*yield*/, this.database.query(query, { type: this.database.QueryTypes.SELECT })];
                    case 2:
                        repo_metrics = _g.sent();
                        saveToFile(repo_metrics, this.config.storage, 'metrics');
                        return [4 /*yield*/, this.database.models.Organisation.findAll()];
                    case 3:
                        orgs = _g.sent();
                        orgs = orgs.map(function (x) {
                            return x.dataValues;
                        });
                        saveToFile(orgs, this.config.storage, 'organisations');
                        stats = {};
                        _a = stats;
                        return [4 /*yield*/, this.database.models.Repository.sum('stars')];
                    case 4:
                        _a.stars = _g.sent();
                        _b = stats;
                        return [4 /*yield*/, this.database.models.Repository.count()];
                    case 5:
                        _b.projects = _g.sent();
                        _c = stats;
                        return [4 /*yield*/, this.database.models.Repository.count({
                                col: 'language',
                                distinct: true
                            })];
                    case 6:
                        _c.languages = _g.sent();
                        _d = stats;
                        return [4 /*yield*/, this.database.models.Repository.sum('forks')];
                    case 7:
                        _d.forks = _g.sent();
                        _e = stats;
                        return [4 /*yield*/, this.database.models.Member.count()];
                    case 8:
                        _e.members = _g.sent();
                        _f = stats;
                        return [4 /*yield*/, this.database.models.Contribution.count({
                                col: 'user_id',
                                distinct: true
                            })];
                    case 9:
                        _f.contributors = _g.sent();
                        saveToFile(stats, this.config.storage, 'statistics');
                        return [2 /*return*/];
                }
            });
        });
    };
    return ExportClient;
}());
