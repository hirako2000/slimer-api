// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const USER = $USER;
const PASS = $PASS;
const REPO = 'github.com/$USER/$PASS';
 
const fs = require('fs')
const git = require('simple-git');
const remote = `https://${USER}:${PASS}@${REPO}`;

export default (req, res) => {
  var user = req.body.user
  var srcimage = req.body.srcimage
  var dstimage = req.body.dstimage
  var srcuser = req.body.srcuser
  
  git().silent(true)
  .clone(remote)
  .then(() => {
    console.log("creating branch")
    git().branch(dstimage)
    .then(() => {
      
      
    fs.readFile('docker-push.sh', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/$DOCKER_USERNAME/g, req.body.dockerusername);
      result = data.replace(/$DOCKER_PASSWORD/g, req.body.dockerpassword);
      result = data.replace(/$SRC_USER/g, srcuser);
      result = data.replace(/$SRC_IMAGE/g, srcimage);
      result = data.replace(/$DST_IMAGE/g, dstimage);
      
      fs.writeFile('docker-push.sh', result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
    git().push()
    })
  })
  .catch((err) => console.error('failed: ', err));
  
  res.statusCode = 200
  res.json({ result: 'Triggered slimer process from ' + srcuser + '/' + srcimage + ' to ' + user + '/' + dstimage  })
}
