var fs = require('fs');
var path = require('path');
var performance = require('perf_hooks').performance;
var barlogger = function () {
    var result = {};
    result.log = function () {
        process.stdout.write('.');
    };
    return result;
};
var runTask = function (task, filter) {
    if (filter.indexOf("!".concat(task)) > -1)
        return false;
    if (filter === '*' || filter.indexOf('*') > -1 || filter.indexOf(task) > -1)
        return true;
    return false;
};
var timePassed = function (startTime) {
    var duration = performance.now() - startTime;
    var milliseconds = (duration % 1000) / 100, seconds = (duration / 1000) % 60, minutes = (duration / (1000 * 60)) % 60, hours = (duration / (1000 * 60 * 60)) % 24;
    hours = hours < 10 ? "0".concat(hours) : hours;
    minutes = minutes < 10 ? "0".concat(minutes) : minutes;
    seconds = seconds < 10 ? "0".concat(seconds) : seconds;
    console.log("  \u23F1   Time passed: ".concat(hours, ":").concat(minutes, ":").concat(seconds, ".").concat(milliseconds));
};
var getTasks = function (dir, filter) {
    var tasks = [];
    var globalPath = __dirname + '/tasks/' + dir + '/';
    var localPath = process.cwd() + '/' + dir + '/';
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
var getClients = function () {
    var tasks = [];
    var localPath = process.cwd() + '/client/';
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
var minimalConfig = {
    github: {
        token: ''
    },
    tasks: ['*'],
    orgs: ['*']
};
// default config
var defaultConfig = {
    github: {
        token: '',
        url: {
            git: 'https://github.com',
            api: 'https://api.github.com',
            raw: 'https://raw.githubusercontent.com'
        }
    },
    tasks: ['*'],
    orgs: ['*'],
    db: {
        database: 'roadblock',
        dialect: 'sqlite',
        storage: './roadblock.sqlite',
        host: 'localhost'
    },
    export: {
        storage: './'
    },
    externalProjects: []
};
var uniqueFilter = function (value, index, self) {
    return self.indexOf(value) === index;
};
module.exports = {
    barlogger: barlogger,
    runTask: runTask,
    getTasks: getTasks,
    getClients: getClients,
    timePassed: timePassed,
    defaultConfig: defaultConfig,
    minimalConfig: minimalConfig,
    uniqueFilter: uniqueFilter
};
