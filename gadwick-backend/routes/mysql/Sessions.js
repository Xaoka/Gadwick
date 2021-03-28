var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
var mysql = require('mysql');

router.get('/auth/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    // Grab all sessions for:
    //  Apps I own
    //  Apps I've accepted invites to
    //  Fetch the app names and user names for these sessions
    const sessions = (await awaitQuery(`SELECT Sessions.id, started_on, status, Sessions.app_id, app_version, feature_ids, type, Apps.app_name, user_name, SUM(IF(STRCMP(passed, "false"), 1.0, 0.0)) features_passed FROM Sessions LEFT JOIN (SELECT Applications.id app_id, Applications.name app_name, user_id app_user_id FROM Applications) Apps ON Apps.app_id = Sessions.app_id LEFT JOIN (SELECT * FROM AppUsers WHERE invite_status = "Accepted") AU ON Apps.app_id = AU.app_id LEFT JOIN (SELECT id user_id, name user_name FROM Users) U ON U.user_id = Sessions.user_id LEFT JOIN (SELECT session_id, passed FROM Results) R ON R.session_id = Sessions.id WHERE Sessions.user_id = ${mysql.escape(id)} OR U.user_id = ${mysql.escape(id)} OR Apps.app_user_id = ${mysql.escape(id)} GROUP BY Sessions.id ORDER BY started_on DESC`));
    res.send(sessions)
});

router.get('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const session = (await awaitQuery(`SELECT * FROM Sessions LEFT JOIN (SELECT id aid, name app_name FROM Applications) as Apps ON app_id = Apps.aid WHERE Sessions.id = ${mysql.escape(id)}`));
    res.send(session)
});

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.started_on = (new Date(Date.now())).toISOString();
    req.body.status = "NOT_STARTED";
    // TODO: Derive features from type
    const type = req.body.type;
    let features = [];
    console.log(`TYPE: ${type}`)
    if (type == "REGRESSION")
    {
        if (!req.body.app_id)
        {
            res.status(400).send("No app_id in body.");
            return;
        }
        features = (await awaitQuery(`SELECT Features.id FROM Features LEFT JOIN Applications ON Features.app_id = Applications.id WHERE Applications.id = ${mysql.escape(req.body.app_id)}`));
    }
    else if (type == "INTEGRATION")
    {
        if (!req.body.app_id)
        {
            res.status(400).send("No app_id in body.");
            return;
        }
        if (!req.body.app_version)
        {
            res.status(400).send("No app_version in body.");
            return;
        }
        features = await awaitQuery(`SELECT Features.id FROM Features LEFT JOIN Applications ON Features.app_id = Applications.id WHERE Applications.id = ${mysql.escape(req.body.app_id)} AND Features.id NOT IN (SELECT feature_id FROM Results WHERE feature_id IS NOT NULL AND NOT version = ${mysql.escape(req.body.app_version)} GROUP BY feature_id)`)
    }
    else if (type == "TAGGED")
    {
        if (!req.body.tag)
        {
            res.status(400).send("No tag in body.");
            return;
        }
        console.log(`TAG: ${req.body.tag}`);
        features = await awaitQuery(`SELECT F.feature_id id FROM Tags LEFT JOIN (SELECT id feature_id, tag FROM Features) AS F ON Tags.id = F.tag WHERE Tags.id = ${mysql.escape(req.body.tag)}`);
    }
    else if (type == "EXPLORATORY")
    {
        //
    }
    else
    {
        res.status(400).send("Invalid test type");
        return;
    }
    console.log(`FEATURES: '${features}'.`)
    req.body.feature_ids = JSON.stringify(features.map((f) => f.id));

    console.log("Saving session")
    delete(req.body.tag);
    insertInto(["app_id", "app_version", "user_id", "started_on", "status", "feature_ids", "type"], [], "Sessions", req, res, next);
});

router.put('/:session_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.session_id;
    const response = await update(req.body, ["status", "submitted"], "Sessions", id);
    res.send(response)
});

module.exports = router;