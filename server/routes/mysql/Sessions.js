var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');

router.get('/auth/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const sessions = (await awaitQuery(`SELECT * FROM Sessions WHERE user_id = '${id}'`));
    res.send(sessions)
});

router.get('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const session = (await awaitQuery(`SELECT * FROM Sessions LEFT JOIN (SELECT id aid, name appName FROM Applications) as Apps ON app_id = Apps.aid WHERE Sessions.id = '${id}'`));
    res.send(session)
});

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.started_on = (new Date(Date.now())).toISOString();
    req.body.status = "NOT_STARTED";
    insertInto(["app_id", "app_version", "user_id", "started_on", "status", "feature_ids"], "Sessions", req, res, next);
});

router.put('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const response = await update(req.body, ["status"], "Sessions", id);
    res.send(response)
});

module.exports = router;