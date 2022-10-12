"use strict";
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
exports.Client = void 0;
// Classes for handling each type of data from github
var Organisation = require("./organisation.js");
var repository_1 = require("./repository");
var Member = require("./member.js");
var Collaborator = require("./collaborator.js");
var PullRequest = require("./pullrequest.js");
var Commit = require("./commit.js");
var Contribution = require("./contribution.js");
var Issue = require("./issue.js");
var CommunityProfile = require("./communityprofile.js");
var ExternalContribution = require("./externalcontribution.js");
var Topic = require("./topic.js");
var Release = require("./release.js");
var calendar_1 = require("./calendar");
var Vulnerability = require("./vulnerability.js");
var Metrics = require("./metrics.js");
var base_1 = require("./base");
var Dependents = require("./dependents.js");
var Dependency = require("./dependency.js");
function Client(github, database, reset, externalTypes) {
    if (reset === void 0) { reset = false; }
    if (externalTypes === void 0) { externalTypes = []; }
    return __awaiter(this, void 0, void 0, function () {
        var s, _i, externalTypes_1, client, cl, _a, externalTypes_2, client, ex_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    s = {
                        ClientBase: undefined,
                        Calendar: undefined,
                        Organisation: undefined,
                        Repository: undefined,
                        Member: undefined,
                        Collaborator: undefined,
                        PullRequest: undefined,
                        Commit: undefined,
                        Contribution: undefined,
                        Dependents: undefined,
                        Dependency: undefined,
                        Issue: undefined,
                        CommunityProfile: undefined,
                        ExternalContribution: undefined,
                        Topic: undefined,
                        Release: undefined,
                        Vulnerability: undefined,
                        Metrics: undefined,
                    };
                    s.ClientBase = base_1.Base;
                    //Setup helper calendar table for grouping activity based on months
                    s.Calendar = new calendar_1.Calendar(github, database);
                    s.Calendar.define();
                    // Initialize the clients for each individual github api object
                    s.Organisation = new Organisation(github, database);
                    s.Organisation.define();
                    s.Repository = new repository_1.Repository(github, database);
                    s.Repository.define();
                    s.Member = new Member(github, database);
                    s.Member.define();
                    s.Collaborator = new Collaborator(github, database);
                    s.Collaborator.define();
                    s.PullRequest = new PullRequest(github, database);
                    s.PullRequest.define();
                    s.Commit = new Commit(github, database);
                    s.Commit.define();
                    s.Contribution = new Contribution(github, database);
                    s.Contribution.define();
                    s.Dependents = new Dependents(github, database);
                    s.Dependents.define();
                    s.Dependency = new Dependency(github, database);
                    s.Dependency.define();
                    s.Issue = new Issue(github, database);
                    s.Issue.define();
                    s.CommunityProfile = new CommunityProfile(github, database);
                    s.CommunityProfile.define();
                    s.ExternalContribution = new ExternalContribution(github, database);
                    s.ExternalContribution.define();
                    s.Topic = new Topic(github, database);
                    s.Topic.define();
                    s.Release = new Release(github, database);
                    s.Release.define();
                    s.Vulnerability = new Vulnerability(github, database);
                    s.Vulnerability.define();
                    s.Metrics = new Metrics(github, database);
                    s.Metrics.define();
                    for (_i = 0, externalTypes_1 = externalTypes; _i < externalTypes_1.length; _i++) {
                        client = externalTypes_1[_i];
                        try {
                            cl = new client.obj(github, database);
                            s[client.obj.name] = cl;
                            s[client.obj.name].define();
                        }
                        catch (ex) {
                            console.log(client.file + ' - ' + ex);
                        }
                    }
                    // finally sync the database so all schemas are in place
                    return [4 /*yield*/, s.Calendar.sync(reset)];
                case 1:
                    // finally sync the database so all schemas are in place
                    _b.sent();
                    return [4 /*yield*/, s.Organisation.sync(reset)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, s.Member.sync(reset)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, s.Repository.sync(reset)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, s.Collaborator.sync(reset)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, s.PullRequest.sync(reset)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, s.Commit.sync(reset)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, s.Contribution.sync(reset)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, s.Dependents.sync(reset)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, s.Dependency.sync(reset)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, s.Issue.sync(reset)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, s.CommunityProfile.sync(reset)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, s.ExternalContribution.sync(reset)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, s.Topic.sync(reset)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, s.Release.sync(reset)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, s.Vulnerability.sync(reset)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, s.Metrics.sync(reset)];
                case 17:
                    _b.sent();
                    _a = 0, externalTypes_2 = externalTypes;
                    _b.label = 18;
                case 18:
                    if (!(_a < externalTypes_2.length)) return [3 /*break*/, 23];
                    client = externalTypes_2[_a];
                    _b.label = 19;
                case 19:
                    _b.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, s[client.obj.name].sync(reset)];
                case 20:
                    _b.sent();
                    return [3 /*break*/, 22];
                case 21:
                    ex_1 = _b.sent();
                    return [3 /*break*/, 22];
                case 22:
                    _a++;
                    return [3 /*break*/, 18];
                case 23: return [4 /*yield*/, database.sync({ force: reset })];
                case 24:
                    _b.sent();
                    return [2 /*return*/, s];
            }
        });
    });
}
exports.Client = Client;
