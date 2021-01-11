var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
var mysql = require('mysql');

router.get('/', cors(corsOptions), async function(req, res, next) {
    const response = await awaitQuery("SELECT * FROM Results LEFT JOIN Features ON Results.feature_id = Features.id");
    res.send(response);
});
router.get('/session/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    const response = await awaitQuery(`SELECT * FROM Results LEFT JOIN Features ON Results.feature_id = Features.id WHERE session_id = "${mysql.escape(id)}"`);
    res.send(response);
});

router.post('/', cors(corsOptions), function(req, res, next) {
    // TODO: Verify credentials here?
    insertInto(["passed", "version", "feature_id", "automated"], ["session_id"], "Results", req, res, next);
});

router.get('/versions', cors(corsOptions), async function(req, res, next) {
    const response = await awaitQuery(`SELECT version, AVG(IF(STRCMP(passed, "true"), 0.0, 1.0)) 'passRate' FROM Results group by version`);
    res.send(response);
});

module.exports = router;