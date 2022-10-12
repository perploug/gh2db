"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseClient = void 0;
var __1 = require("..");
function createDatabaseClient(config) {
    return new __1.DatabaseClient(config);
}
exports.createDatabaseClient = createDatabaseClient;
