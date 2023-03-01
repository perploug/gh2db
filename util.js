const { performance } = require('perf_hooks');

const barlogger = function () {
  const result = {};
  result.log = () => {
    process.stdout.write('.');
  };
  return result;
};

const runTask = function (task, filter) {
  if (filter.indexOf(`!${task}`) > -1) return false;
  if (filter === '*' || filter.indexOf('*') > -1 || filter.indexOf(task) > -1)
    return true;

  return false;
};

const timePassed = function (startTime) {
  var duration = performance.now() - startTime;

  var milliseconds = (duration % 1000) / 100,
    seconds = (duration / 1000) % 60,
    minutes = (duration / (1000 * 60)) % 60,
    hours = (duration / (1000 * 60 * 60)) % 24;

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  console.log(
    `  ⏱   Time passed: ${hours}:${minutes}:${seconds}.${milliseconds}`
  );
};

const getDateXDaysAgo = function (numOfDays, date = new Date()) {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};

const delay = function (n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
};

const uniqueFilter = (value, index, self) => {
  return self.indexOf(value) === index;
};

module.exports = {
  barlogger,
  runTask,
  timePassed,
  delay,
  uniqueFilter,
  getDateXDaysAgo,
};
