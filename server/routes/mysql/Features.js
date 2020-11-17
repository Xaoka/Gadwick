var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { makeQuery } = require('./mysql');

router.get('/', cors(corsOptions), function(req, res, next) {
    makeQuery("SELECT * FROM Features", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
module.exports = router;