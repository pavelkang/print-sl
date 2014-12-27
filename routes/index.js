var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('views/index.html');
});

router.post('/api/upload', function(req, res) {
  console.log("Received a POST");
  console.log(req.body);
  console.log(req.files);
  /*
    if error is empty string, notify the user success. Otherwise, notify failure
  */
  res.send("");
})

module.exports = router;
