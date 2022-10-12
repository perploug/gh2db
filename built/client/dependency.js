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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Base = require('./base.js');
var Sequelize = require('sequelize');
var helper = require('./helper.js');
var LicenseLookup = require('license-lookup').LicenseLookup;
var fetch = require('node-fetch');
var mapper = require('object-mapper');
module.exports = /** @class */ (function (_super) {
    __extends(Dependency, _super);
    function Dependency(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        _this.schema = {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            key: Sequelize.STRING(300),
            name: Sequelize.STRING(300),
            type: Sequelize.STRING(20),
        };
        _this.map = {
            key: 'key',
            type: 'type',
            name: 'name',
        };
        _this.name = 'Dependency';
        return _this;
    }
    Dependency.prototype.sync = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.belongsToMany(this.dbClient.models.Repository, {
                            through: 'RepositoryDependency',
                            foreignKey: 'dep_id',
                        });
                        return [4 /*yield*/, _super.prototype.sync.call(this, true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Dependency.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deps, repositories, ll, found, _i, repositories_1, repo, files, matchedFiles, _a, _b, match, file, manifest, detectedDependencies, _c, detectedDependencies_1, dep, key, rs, ex_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        deps = {};
                        return [4 /*yield*/, this.dbClient.models.Repository.findAll({
                                where: {
                                    fork: false,
                                    private: false,
                                    archived: false,
                                },
                            })];
                    case 1:
                        repositories = _d.sent();
                        ll = new LicenseLookup();
                        found = {};
                        _i = 0, repositories_1 = repositories;
                        _d.label = 2;
                    case 2:
                        if (!(_i < repositories_1.length)) return [3 /*break*/, 13];
                        repo = repositories_1[_i];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 11, , 12]);
                        return [4 /*yield*/, this.ghClient.getFileList(repo.dataValues.owner, repo.dataValues.name)];
                    case 4:
                        files = _d.sent();
                        files = files.filter(function (x) { return x.type === 'file'; }).map(function (x) { return x.path; });
                        matchedFiles = ll.matchFilesToManager(files);
                        _a = 0, _b = Object.values(matchedFiles);
                        _d.label = 5;
                    case 5:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        match = _b[_a];
                        return [4 /*yield*/, fetch("https://raw.githubusercontent.com/".concat(repo.dataValues.owner, "/").concat(repo.dataValues.name, "/").concat(repo.dataValues.default_branch, "/").concat(match.file))];
                    case 6:
                        file = _d.sent();
                        if (!file.ok) return [3 /*break*/, 9];
                        return [4 /*yield*/, file.text()];
                    case 7:
                        manifest = _d.sent();
                        return [4 /*yield*/, match.manager.detect(manifest)];
                    case 8:
                        detectedDependencies = _d.sent();
                        for (_c = 0, detectedDependencies_1 = detectedDependencies; _c < detectedDependencies_1.length; _c++) {
                            dep = detectedDependencies_1[_c];
                            key = match.manager.name + '.' + dep.name;
                            if (!found[key]) {
                                rs = [];
                                rs.push(repo.id);
                                found[key] = {
                                    name: dep.name,
                                    type: match.manager.name,
                                    key: key,
                                    repos: rs,
                                };
                            }
                            else
                                found[key].repos.push(repo.id);
                        }
                        _d.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 5];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        ex_1 = _d.sent();
                        console.log(ex_1);
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 2];
                    case 13: 
                    // add to one long dictionary so we only look up things once.. (check the lib to see if it already caches.)
                    return [2 /*return*/, Object.values(found)];
                }
            });
        });
    };
    Dependency.prototype.saveOrUpdate = function (dependency, repos) {
        return __awaiter(this, void 0, void 0, function () {
            var dbDependency, instance, _i, repos_1, repo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbDependency = mapper(dependency, this.map);
                        return [4 /*yield*/, this.model.create(dbDependency)];
                    case 1:
                        instance = _a.sent();
                        for (_i = 0, repos_1 = repos; _i < repos_1.length; _i++) {
                            repo = repos_1[_i];
                            if (repo > 0) {
                                try {
                                    instance.addRepository(repo);
                                    //   this.model.addRepository(instance.id, repo);
                                }
                                catch (ex) {
                                    console.log('Could not associate: dep:' + instance.id + ' and repo: ' + repo);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Dependency.prototype.bulkCreate = function (dependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, dependencies_1, dep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, dependencies_1 = dependencies;
                        _a.label = 1;
                    case 1:
                        if (!(_i < dependencies_1.length)) return [3 /*break*/, 4];
                        dep = dependencies_1[_i];
                        return [4 /*yield*/, this.saveOrUpdate(dep, __spreadArray([], new Set(dep.repos), true))];
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
    return Dependency;
}(Base));
