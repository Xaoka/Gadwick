var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');

router.get('/auth/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const sessions = (await awaitQuery(`SELECT id, started_on, status, Sessions.app_id, app_version, feature_ids, app_name, user_name, SUM(IF(STRCMP(passed, "true"), 0.0, 1.0)) features_passed FROM Sessions LEFT JOIN (SELECT id app_id, name app_name FROM Applications) Apps ON Apps.app_id = Sessions.app_id LEFT JOIN (SELECT id user_id, name user_name FROM Users) U ON U.user_id = Sessions.user_id LEFT JOIN (SELECT session_id, passed FROM Results) R ON R.session_id = Sessions.id WHERE Sessions.user_id = "${id}" GROUP BY Sessions.id ORDER BY started_on DESC`));
    res.send(sessions)
});

router.get('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const session = (await awaitQuery(`SELECT * FROM Sessions LEFT JOIN (SELECT id aid, name app_name FROM Applications) as Apps ON app_id = Apps.aid WHERE Sessions.id = '${id}'`));
    res.send(session)
});

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.started_on = (new Date(Date.now())).toISOString();
    req.body.status = "NOT_STARTED";
    insertInto(["app_id", "app_version", "user_id", "started_on", "status", "feature_ids"], [], "Sessions", req, res, next);
});

router.put('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const response = await update(req.body, ["status", "submitted"], "Sessions", id);
    res.send(response)
});

module.exports = router;