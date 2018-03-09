var express = require('express');
var router = express.Router();

/* GET users listing. */
/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
