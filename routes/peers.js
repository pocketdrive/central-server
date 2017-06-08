/**
 * Created by anuradhawick on 6/8/17.
 */
var express = require('express');
var fs = require('fs');

var router = express.Router();


/* Render the static html page */
router.get('/', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('routes/peers.html'));
});

module.exports = router;