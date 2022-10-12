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
exports.Bootstrap = void 0;
var fs = require("fs");
var path = require("path");
var perf_hooks_1 = require("perf_hooks");
var dottie = require("dottie");
var github_1 = require("../github/");
var database_1 = require("../database");
var client_1 = require("../client");
var configs = require('./config');
var taskTypes = ['pre', 'org', 'repo', 'post', 'metrics'];
Object.defineProperty(Array.prototype, 'chunk', {
    value: function (chunkSize) {
        var array = this;
        return [].concat.apply([], array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        }));
    },
});
var Bootstrap = /** @class */ (function () {
    function Bootstrap(localDir, roadblockDir) {
        if (localDir === void 0) { localDir = null; }
        if (roadblockDir === void 0) { roadblockDir = null; }
        if (!roadblockDir)
            roadblockDir = path.join(__dirname, '..');
        if (!localDir)
            localDir = process.cwd();
        this.localConfig = localDir + '/roadblock.json';
        this.localDir = localDir;
        this.roadblockDir = roadblockDir;
        this.context = null;
    }
    Bootstrap.prototype.localConfigExists = function () {
        return fs.existsSync(this.localConfig);
    };
    Bootstrap.prototype.config = function (args) {
        if (args === void 0) { args = []; }
        if (!this.localConfigExists())
            throw 'Roadblock configuration not found';
        var localConfig = require(this.localConfig);
        var config = __assign(__assign({}, configs.defaultConfig), localConfig);
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            var keyval = arg.split('=');
            if (keyval.length > 1) {
                var val = keyval[1];
                if (val.indexOf('[') == 0 || val.indexOf('{') == 0) {
                    val = JSON.parse(val.replace(/'/g, '"'));
                }
                dottie.set(config, keyval[0], val);
            }
        }
        return config;
    };
    Bootstrap.prototype.setupDirectory = function () {
        console.log('  ℹ️   Creating roadblock.json configuration file');
        var json = JSON.stringify(configs.minimalConfig, null, 4);
        fs.writeFileSync(this.localConfig, json, 'utf8');
        console.log('  ✅   Default config created - update the configuration and re-run the roadblock command');
        return true;
    };
    Bootstrap.prototype.getContext = function (config, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            var context, _a, externalClients, _b, _i, taskTypes_1, type;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!forceRefresh && this.context !== null)
                            return [2 /*return*/, this.context];
                        context = {
                            start: 0,
                            github: undefined,
                            database: undefined,
                            client: undefined,
                            exportClient: undefined,
                            ui: undefined,
                            tasks: undefined,
                        };
                        context.start = perf_hooks_1.performance.now();
                        context.github = (0, github_1.createGithubClient)(config.github.token, config.github.url.api);
                        _a = context;
                        return [4 /*yield*/, (0, database_1.createDatabaseClient)(config).db()];
                    case 1:
                        _a.database = _c.sent();
                        externalClients = this._getClients().map(function (x) {
                            return { file: x, obj: require(x) };
                        });
                        _b = context;
                        return [4 /*yield*/, (0, client_1.Client)(context.github, context.database, false, externalClients)];
                    case 2:
                        _b.client = _c.sent();
                        context.ui = {};
                        context.tasks = {};
                        for (_i = 0, taskTypes_1 = taskTypes; _i < taskTypes_1.length; _i++) {
                            type = taskTypes_1[_i];
                            context.tasks[type] = this._getTasks(type, config.tasks).map(this.loadTask);
                        }
                        return [2 /*return*/, context];
                }
            });
        });
    };
    Bootstrap.prototype.validateScopes = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var scopes, scopesValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.getScopes()];
                    case 1:
                        scopes = (_a.sent()).map(function (x) { return x.trim(); });
                        scopesValid = true;
                        if (scopes.indexOf('repo') < 0) {
                            console.error("  \u26A0\uFE0F  OAuth token does not have repo scope access");
                            scopesValid = false;
                        }
                        if (scopes.indexOf('read:org') < 0) {
                            console.error("  \u26A0\uFE0F  OAuth token does not have read:org scope access");
                            scopesValid = false;
                        }
                        if (scopes.indexOf('read:user') < 0 && scopes.indexOf('user') < 0) {
                            console.error("  \u26A0\uFE0F  OAuth token does not have read:user scope access");
                            scopesValid = false;
                        }
                        if (!scopesValid) {
                            throw 'Github auth token does not have the correct access scopes configured';
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Bootstrap.prototype.runTasks = function (name, tasks, context, config) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, tasks_1, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(tasks.length > 0)) return [3 /*break*/, 4];
                        console.log('');
                        console.log("Running ".concat(tasks.length, " ").concat(name, " tasks"));
                        _i = 0, tasks_1 = tasks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tasks_1.length)) return [3 /*break*/, 4];
                        task = tasks_1[_i];
                        return [4 /*yield*/, task.func(context, config)];
                    case 2:
                        _a.sent();
                        console.log(" \u2713 task:".concat(task.alias, " complete "));
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Bootstrap.prototype.listLoadedTasks = function (context) {
        console.log('');
        console.log("Tasks loaded:");
        for (var _i = 0, taskTypes_2 = taskTypes; _i < taskTypes_2.length; _i++) {
            var type = taskTypes_2[_i];
            console.log('  - ' + type + ': ' + context.tasks[type].length + ' tasks');
        }
    };
    Bootstrap.prototype.runOrganisationTasks = function (tasks, context, config) {
        return __awaiter(this, void 0, void 0, function () {
            var orgs, _i, orgs_1, org, _a, _b, orgTaskFunc, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(tasks.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, context.client.Organisation.model.findAll()];
                    case 1:
                        orgs = _c.sent();
                        console.log('');
                        console.log("Running ".concat(tasks.length, " organisation tasks on ").concat(orgs.length, " imported github organisations"));
                        _i = 0, orgs_1 = orgs;
                        _c.label = 2;
                    case 2:
                        if (!(_i < orgs_1.length)) return [3 /*break*/, 7];
                        org = orgs_1[_i];
                        _a = 0, _b = context.tasks.org;
                        _c.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        orgTaskFunc = _b[_a];
                        return [4 /*yield*/, orgTaskFunc.func(org, context, config)];
                    case 4:
                        result = _c.sent();
                        console.log(" \u2713 task:".concat(orgTaskFunc.alias, " complete "));
                        _c.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Bootstrap.prototype.runRepositoryTasks = function (tasks, context, config) {
        return __awaiter(this, void 0, void 0, function () {
            var repositories, chunkedRepos, _i, tasks_2, repoTaskFunc, task_queue, done, repos_count, _a, chunkedRepos_1, repoChunk, _b, repoChunk_1, repository;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(tasks.length > 0)) return [3 /*break*/, 16];
                        return [4 /*yield*/, context.client.Repository.model.findAll({
                                where: {
                                    fork: false,
                                },
                            })];
                    case 1:
                        repositories = _c.sent();
                        if (!(repositories.length > 0)) return [3 /*break*/, 15];
                        console.log('');
                        console.log("Running ".concat(tasks.length, " repository tasks on ").concat(repositories.length, " imported github repositories"));
                        chunkedRepos = repositories.chunk(5);
                        _i = 0, tasks_2 = tasks;
                        _c.label = 2;
                    case 2:
                        if (!(_i < tasks_2.length)) return [3 /*break*/, 14];
                        repoTaskFunc = tasks_2[_i];
                        task_queue = [];
                        done = 0;
                        repos_count = 0;
                        process.stdout.write(" \u29D6 task:".concat(repoTaskFunc.alias, ": 0% done"));
                        _a = 0, chunkedRepos_1 = chunkedRepos;
                        _c.label = 3;
                    case 3:
                        if (!(_a < chunkedRepos_1.length)) return [3 /*break*/, 12];
                        repoChunk = chunkedRepos_1[_a];
                        _b = 0, repoChunk_1 = repoChunk;
                        _c.label = 4;
                    case 4:
                        if (!(_b < repoChunk_1.length)) return [3 /*break*/, 9];
                        repository = repoChunk_1[_b];
                        if (!(!repository.fork &&
                            repository.name !== 'linux' &&
                            !repository.private)) return [3 /*break*/, 8];
                        context.externalValuesMap = { repository_id: repository.id };
                        if (!(repoTaskFunc.alias === 'dependents')) return [3 /*break*/, 6];
                        return [4 /*yield*/, repoTaskFunc.func(repository, context, config)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        task_queue.push(repoTaskFunc.func(repository, context, config));
                        _c.label = 7;
                    case 7:
                        repos_count++;
                        _c.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 4];
                    case 9: return [4 /*yield*/, Promise.allSettled(task_queue)];
                    case 10:
                        _c.sent();
                        done++;
                        process.stdout.clearLine(0);
                        process.stdout.cursorTo(0);
                        process.stdout.write(" \u29D6 task:".concat(repoTaskFunc.alias, ": ").concat(Math.round((done / chunkedRepos.length) * 100), "% done (").concat(repos_count, ")"));
                        _c.label = 11;
                    case 11:
                        _a++;
                        return [3 /*break*/, 3];
                    case 12:
                        process.stdout.clearLine(0);
                        process.stdout.cursorTo(0);
                        process.stdout.write(" \u2713 task:".concat(repoTaskFunc.alias, " complete \n"));
                        _c.label = 13;
                    case 13:
                        _i++;
                        return [3 /*break*/, 2];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        console.log('');
                        console.log(' x  No repositories downloaded');
                        _c.label = 16;
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    Bootstrap.prototype._getTasks = function (dir, filter) {
        var tasks = [];
        var globalPath = this.roadblockDir + '/tasks/' + dir + '/';
        var localPath = this.localDir + '/' + dir + '/';
        var allowTask = function (filename) {
            var key = (dir + '/' + filename.replace('.js', '')).toLowerCase();
            if (filter.indexOf("!".concat(dir, "/*")) > -1)
                return false;
            if (filter.indexOf("!".concat(key)) > -1)
                return false;
            if (filter.indexOf('*') > -1 ||
                filter.indexOf(key) > -1 ||
                filter.indexOf(dir + '/*') > -1)
                return true;
        };
        if (fs.existsSync(globalPath)) {
            for (var _i = 0, _a = fs.readdirSync(globalPath); _i < _a.length; _i++) {
                var file = _a[_i];
                if (allowTask(file))
                    tasks.push(globalPath + file);
            }
        }
        if (fs.existsSync(localPath)) {
            for (var _b = 0, _c = fs.readdirSync(localPath); _b < _c.length; _b++) {
                var file = _c[_b];
                if (allowTask(file))
                    tasks.push(localPath + file);
            }
        }
        return tasks;
    };
    Bootstrap.prototype.loadTask = function (taskpath) {
        return {
            func: require(taskpath),
            path: taskpath,
            alias: path.parse(taskpath).name,
        };
    };
    Bootstrap.prototype._getClients = function () {
        var tasks = [];
        var localPath = this.localDir + '/client/';
        if (fs.existsSync(localPath)) {
            for (var _i = 0, _a = fs
                .readdirSync(localPath)
                .filter(function (x) { return path.extname(x) === '.js'; }); _i < _a.length; _i++) {
                var file = _a[_i];
                tasks.push(localPath + file);
            }
        }
        return tasks;
    };
    return Bootstrap;
}());
exports.Bootstrap = Bootstrap;
