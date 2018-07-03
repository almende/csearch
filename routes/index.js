var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    let output = '';
    console.log('stap een');
    res.send(output);
    console.log('stap drie');


});

module.exports = router;
