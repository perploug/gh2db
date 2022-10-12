const os = require('os');

const fetch = require('node-fetch');
//const cachedRequest = require('cached-request')(request);
//cachedRequest.setCacheDirectory(os.tmpdir());

const cacheStaleTimeout = 100; // minutes

async function getGithubPage(url) {
  var requestOptions = {
    url,
    ttl: cacheStaleTimeout * 60 * 1000,
  };
  cachedRequest(requestOptions, function (error, response, body) {
    if (error) {
      throw error;
    }
    if (response && response.statusCode === 200) {
      return callback(body);
    } else {
      return callback(404);
    }
  });
}

module.exports = getGithubPage;
