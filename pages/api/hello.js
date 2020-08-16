// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const USER = process.env.USER;
const PASS = process.env.PASS;
const TRAVIS_TOKEN = process.env.TRAVIS_TOKEN;

const http = require('https');

export default (request, res) => {
  var user = request.query.user
  var srcimage = request.query.srcimage
  var dstimage = request.query.dstimage
  var srcuser = request.query.srcuser
  var dockerpassword = request.query.dockerpassword
  var dockerusername = request.query.dockerusername
  var dstuser = request.query.dstuser
  
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
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `token ${TRAVIS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Travis-API-Version': '3',
    }
  };
  
  const instance = axios.create({
    baseURL: 'https://' + options.hostname,
    timeout: 1000,
    headers: options.headers
  });
 
  axios({
    method: 'post',
    url: options.path,
    data: JSON.stringify(postData)
  });
  
  res.statusCode = 200
  res.json({ result: 'Triggered slimer process from ' + srcuser + '/' + srcimage + ' to ' + dstuser + '/' + dstimage  })
};
