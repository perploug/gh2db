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
var helper = require('./helper.js');
var dependents = require('./dependentsscraper/index');
module.exports = /** @class */ (function (_super) {
    __extends(Dependents, _super);
    function Dependents(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        _this.schema = {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            type: Sequelize.STRING(100),
            org: Sequelize.STRING(100),
            repo: Sequelize.STRING(100),
            stars: Sequelize.BIGINT,
            forks: Sequelize.BIGINT,
            name: Sequelize.STRING(300),
            email: Sequelize.STRING(300),
            company: Sequelize.STRING(300),
            location: Sequelize.STRING(300),
        };
        _this.map = {
            org: 'org',
            repo: 'repo',
            type: 'type',
            repository_id: 'repository_id',
            stars: 'stars',
            forks: 'forks',
            login: 'login',
            name: 'name',
            email: 'email',
            company: 'company',
            location: 'location',
        };
        _this.name = 'Dependents';
        return _this;
    }
    Dependents.prototype.sync = function (force) {
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
    Dependents.prototype.getAll = function (orgName, repoName, repoId) {
        return __awaiter(this, void 0, void 0, function () {
            var packages, repositories, complete, members, _loop_1, this_1, user, _i, members_1, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dependents.getDependentPackages(orgName, repoName)];
                    case 1:
                        packages = _a.sent();
                        return [4 /*yield*/, dependents.getDependentReposotories(orgName, repoName)];
                    case 2:
                        repositories = _a.sent();
                        complete = packages.concat(repositories);
                        members = new Set(complete.map(function (x) { return x.org; }));
                        _loop_1 = function (member) {
                            var _b, _c, entry, ex_1;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this_1.ghClient.getUser(member)];
                                    case 1:
                                        user = _d.sent();
                                        if (user) {
                                            for (_b = 0, _c = complete.filter(function (x) { return x.org === member; }); _b < _c.length; _b++) {
                                                entry = _c[_b];
                                                entry.company = user.company;
                                                entry.email = user.email;
                                                entry.location = user.location;
                                                entry.name = user.name;
                                                entry.repository_id = repoId;
                                            }
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        ex_1 = _d.sent();
                                        console.log(ex_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, members_1 = members;
                        _a.label = 3;
                    case 3:
                        if (!(_i < members_1.length)) return [3 /*break*/, 6];
                        member = members_1[_i];
                        return [5 /*yield**/, _loop_1(member)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, complete];
                }
            });
        });
    };
    return Dependents;
}(Base));
