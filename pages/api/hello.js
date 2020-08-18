// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const USER = process.env.USER;
const PASS = process.env.PASS;
const TRAVIS_TOKEN = process.env.TRAVIS_TOKEN;

const axios = require('axios');
// Log content type
require('axios-debug-log')({
  request: function (debug, config) {
    debug('Request with ' + config.headers['content-type'])
  },
  response: function (debug, response) {
    debug(
      'Response with ' + response.headers['content-type'],
      'from ' + response.config.url
    )
  },
  error: function (debug, error) {
    // Read https://www.npmjs.com/package/axios#handling-errors for more info
    debug('Boom', error)
  }
})

export default (req, res) => {
  var user = req.query.user
  var srcimage = req.query.srcimage
  var dstimage = req.query.dstimage
  var srcuser = req.query.srcuser
  var dockerpassword = req.query.dockerpassword
  var dockerusername = req.query.dockerusername
  var dstuser = req.query.dstuser
  
  console.log("Received query: " + JSON.stringify(req.query));
  
  const postData = {
   'request': {
       'message': 'Override the commit message: this is an api request',
       'branch': 'master',
       'config': {
         'env': {
           'SRC_USER': srcuser,
           'SRC_IMAGE': srcimage,
           'DST_IMAGE': dstimage,
           'DOCKER_PASSWORD': dockerpassword,
           'DOCKER_USERNAME': dockerusername,
           'DST_USER': dstuser
         }
       }
    }
  };
  
  const options = {
    hostname: 'api.travis-ci.com',
    port: 443,
    path: '/repo/hirako2000/slimer/requests',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
      'Authorization': `token ${TRAVIS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Travis-API-Version': '3',
    }
  };
  
  const instance = axios.create({
    port: options.port,
    timeout: 1000,
    headers: options.headers
  });

 
  instance.post(options.hostname + options.path, postData).then(function (response) {
    // handle success
    console.log("Post response:" + response);
    res.statusCode = 200
    res.json({ result: 'Triggered slimer process from ' + srcuser + '/' + srcimage + ' to ' + dstuser + '/' + dstimage  })
  })
  .catch(function (error) {
    // handle error
    console.log("Post error:" + error);
    res.statusCode = 500
    res.json({ result: 'Error' })
  });
  
};
