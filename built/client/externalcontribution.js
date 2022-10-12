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
var Base = require('./base.js');
var Sequelize = require('sequelize');
var helper = require('./helper.js');
module.exports = /** @class */ (function (_super) {
    __extends(ExternalContribution, _super);
    function ExternalContribution(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        _this.schema = {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            login: Sequelize.STRING,
            total: Sequelize.INTEGER,
            user_id: Sequelize.BIGINT,
            repository_name: Sequelize.STRING
        };
        _this.map = {
            id: 'user_id',
            contributions: 'total',
            login: 'login'
        };
        _this.name = 'ExternalContribution';
        return _this;
    }
    ExternalContribution.prototype.getAndStore = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, config_1, target, orgRepos, _a, orgRepos_1, repo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, config_1 = config;
                        _b.label = 1;
                    case 1:
                        if (!(_i < config_1.length)) return [3 /*break*/, 9];
                        target = config_1[_i];
                        if (!(target.org && target.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getAndStoreSingleRepo(target.org, target.name)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 3:
                        if (!target.org) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.ghClient.getRepos(target.org)];
                    case 4:
                        orgRepos = _b.sent();
                        _a = 0, orgRepos_1 = orgRepos;
                        _b.label = 5;
                    case 5:
                        if (!(_a < orgRepos_1.length)) return [3 /*break*/, 8];
                        repo = orgRepos_1[_a];
                        return [4 /*yield*/, this.getAndStoreSingleRepo(target.org, repo.name)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ExternalContribution.prototype.getAndStoreSingleRepo = function (org, repo) {
        return __awaiter(this, void 0, void 0, function () {
            var contributions, dbContribtutions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ghClient.getContributions(org, repo)];
                    case 1:
                        contributions = _a.sent();
                        dbContribtutions = helper
                            .mapArray(contributions, this.map)
                            .map(function (contrib) {
                            return __assign(__assign({}, contrib), { repository_name: repo });
                        });
                        return [4 /*yield*/, this.model.bulkCreate(dbContribtutions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, dbContribtutions];
                }
            });
        });
    };
    ExternalContribution.prototype.removeContributionsWithoutMembers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbClient.query("\n          DELETE FROM ExternalContribution\n          WHERE user_id IS NULL OR user_id NOT IN (\n            SELECT id\n            FROM Member\n          )\n        ")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ExternalContribution;
}(Base));
