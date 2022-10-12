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
//const getGithubPage = require('./getpage.js');
var scrapePage = require('./scrapepage.js');
var fetch = require('node-fetch');
function recurseDependents(_a) {
    var url = _a.url, owner = _a.owner, repository = _a.repository, dependentType = _a.dependentType, limit = _a.limit, _b = _a.entries, entries = _b === void 0 ? [] : _b;
    return __awaiter(this, void 0, void 0, function () {
        var response, data, _c, hasReachedLimit;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _d.sent();
                    if (!response.ok) {
                        console.log('error in getting dependents from scraping');
                        return [2 /*return*/, entries];
                    }
                    _c = scrapePage;
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _c.apply(void 0, [_d.sent(), {
                            owner: owner,
                            repository: repository,
                            dependentType: dependentType,
                        }]);
                    // loead the entries
                    entries = entries.concat(data.entries);
                    hasReachedLimit = entries.length >= limit;
                    // if we have reached the limit, we slice it down..
                    if (hasReachedLimit) {
                        return [2 /*return*/, entries];
                    }
                    // we might have run out of entries, so we discontinue.
                    if (!data.nextPageUrl) {
                        return [2 /*return*/, entries];
                    }
                    return [4 /*yield*/, recurseDependents({
                            url: data.nextPageUrl,
                            owner: owner,
                            repository: repository,
                            dependentType: dependentType,
                            limit: limit,
                            entries: entries,
                        })];
                case 3:
                    entries = _d.sent();
                    return [2 /*return*/, entries];
            }
        });
    });
}
module.exports = recurseDependents;
