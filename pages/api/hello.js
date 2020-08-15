// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const USER = process.env.USER;
const PASS = process.env.PASS;

const Travis = require('travis-ci');
var travis = new Travis({
    version: '2.0.0'
});

const http = require('http');

export default (req, res) => {
  var user = req.query.user
  var srcimage = req.query.srcimage
  var dstimage = req.query.dstimage
  var srcuser = req.query.srcuser
  var dockerpassword = req.query.dockerpassword
  var dockerusername = srcuser || req.query.dockerpassword
  
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
 
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      //console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // Write data to request body
  const postData = "{
   "request": {
   "message": "Override the commit message: this is an api request",
   "branch":"master",
   "config": {
     "env": {
       "SRC_USER": srcuser,
       "SRC_IMAGE": srcimage,
       "DST_IMAGE": dstimage,
       "DOCKER_PASSWORD": dockerpassword,
       "DOCKER_USERNAME": dockerusername
     }
    }
  }}";
  req.write(postData);
  req.end();
  
  res.statusCode = 200
  res.json({ result: 'Triggered slimer process from ' + srcuser + '/' + srcimage + ' to ' + user + '/' + dstimage  })
};
