#!/usr/bin/env node
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
var Bootstrap = require('./app/bootstrap.js');
var app;
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var args, config, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    app = new Bootstrap(process.cwd(), __dirname);
                    if (!app.localConfigExists()) return [3 /*break*/, 2];
                    console.log('Starting roadblock...');
                    console.log(' ✓ roadblock.json found');
                    config = app.config(args);
                    return [4 /*yield*/, app.getContext(config)];
                case 1:
                    context = _a.sent();
                    console.log(' ✓ Context and tasks loaded');
                    return [2 /*return*/, run(config, context)];
                case 2: return [4 /*yield*/, app.setupDirectory()];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function run(config, context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, app.validateScopes(context)];
                case 1:
                    _a.sent();
                    console.log(' ✓ Github scopes valid');
                    // for debugging, inform how many tasks are planned to run
                    app.listLoadedTasks(context);
                    // pre-process - setup calendar and orgs
                    // these tasks have no org or repo passed to them.
                    return [4 /*yield*/, app.runTasks('pre-processing', context.tasks.pre, context, config)];
                case 2:
                    // pre-process - setup calendar and orgs
                    // these tasks have no org or repo passed to them.
                    _a.sent();
                    // run org level tasks
                    return [4 /*yield*/, app.runOrganisationTasks(context.tasks.org, context, config)];
                case 3:
                    // run org level tasks
                    _a.sent();
                    // run repository level tasks
                    return [4 /*yield*/, app.runRepositoryTasks(context.tasks.repo, context, config)];
                case 4:
                    // run repository level tasks
                    _a.sent();
                    // Do all post-process / export tasks
                    return [4 /*yield*/, app.runTasks('post-processing', context.tasks.post, context, config)];
                case 5:
                    // Do all post-process / export tasks
                    _a.sent();
                    // metrics based tasks when post-proc has completed
                    return [4 /*yield*/, app.runTasks('metrics-processing', context.tasks.metrics, context, config)];
                case 6:
                    // metrics based tasks when post-proc has completed
                    _a.sent();
                    console.log('');
                    console.log(" \u2713 Roadblock processing complete");
                    return [2 /*return*/];
            }
        });
    });
}
init();
