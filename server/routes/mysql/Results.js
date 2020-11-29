var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { makeQuery } = require('./mysql');
const { insertInto } = require('./insert');

router.get('/', cors(corsOptions), function(req, res, next) {
    makeQuery("SELECT * FROM Results LEFT JOIN Features ON Results.feature_id = Features.id", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/', cors(corsOptions), function(req, res, next) {
    insertInto(["passed", "version", "feature_id"], "Results", req, res, next);
});

router.get('/versions', cors(corsOptions), function(req, res, next) {
    makeQuery(`SELECT version, AVG(IF(STRCMP(passed, "true"), 0.0, 1.0)) 'passRate' FROM Results group by version`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

module.exports = router;