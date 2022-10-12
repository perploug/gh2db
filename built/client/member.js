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
    __extends(Member, _super);
    function Member(githubClient, databaseClient) {
        var _this = _super.call(this, githubClient, databaseClient) || this;
        _this.schema = {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
            },
            avatar: Sequelize.STRING(400),
            login: Sequelize.STRING(100),
            url: Sequelize.STRING,
            name: Sequelize.STRING(400),
            email: Sequelize.STRING(400),
            company: Sequelize.STRING(400),
            location: Sequelize.STRING(400),
            bio: Sequelize.TEXT,
            employee_id: Sequelize.BIGINT,
            employee_login: Sequelize.STRING,
            employee_title: Sequelize.STRING,
            department: Sequelize.STRING,
            team: Sequelize.STRING,
        };
        _this.map = {
            id: 'id',
            avatar_url: 'avatar',
            html_url: 'url',
            login: 'login',
            name: 'name',
            email: 'email',
            company: 'company',
            location: 'location',
            bio: 'bio',
        };
        // this is still fairly lowlevel - if you need to instatiate this,
        // the org client needs to be loaded
        // first, otherwise this will fail
        _this.name = 'Member';
        return _this;
    }
    Member.prototype.sync = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.belongsToMany(this.dbClient.models.Organisation, {
                            through: 'MemberOrganisation',
                            foreignKey: 'member_id',
                        });
                        return [4 /*yield*/, _super.prototype.sync.call(this, force)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Member.prototype.getAll = function (orgName, logger) {
        return __awaiter(this, void 0, void 0, function () {
            var ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ghClient.getMembers(orgName, logger)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        ex_1 = _a.sent();
                        console.error(ex_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    Member.prototype.saveOrUpdate = function (member, organisation) {
        return __awaiter(this, void 0, void 0, function () {
            var dbMember, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbMember = mapper(member, this.map);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.model.upsert(dbMember)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, organisation.addMember(dbMember.id)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ex_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Member.prototype.bulkCreate = function (members, organisation) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, members_1, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, members_1 = members;
                        _a.label = 1;
                    case 1:
                        if (!(_i < members_1.length)) return [3 /*break*/, 4];
                        member = members_1[_i];
                        return [4 /*yield*/, this.saveOrUpdate(member, organisation)];
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
    return Member;
}(Base));
