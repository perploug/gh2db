"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGithubClient = void 0;
var GithubClient_1 = require("./GithubClient");
function createGithubClient(token, baseurl) {
    return new GithubClient_1.GithubClient(token, baseurl);
}
exports.createGithubClient = createGithubClient;
