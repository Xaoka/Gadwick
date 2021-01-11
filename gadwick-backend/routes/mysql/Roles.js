var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');
var mysql = require('mysql');

router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["app_id", "user_id", "role"], [], "AppUsers", req, res, next);
});

router.get('/apps/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const roles = (await awaitQuery(`SELECT * FROM AppUsers LEFT JOIN (SELECT id user_id, name FROM Users) U ON AppUsers.user_id = U.user_id WHERE app_id = '${mysql.escape(id)}' AND invite_status = "Accepted" AND U.user_id IS NOT NULL`));
    res.send(roles)
});

router.get('/invites/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const invites = (await awaitQuery(`SELECT * FROM AppUsers WHERE app_id = '${mysql.escape(id)}' AND invite_status = "Invited"`));
    res.send(invites)
});

router.post('/invites', cors(corsOptions), async function(req, res, next) {
    // TODO: Check the user isn't already invited!
    const users = await awaitQuery(`SELECT * FROM AppUsers WHERE (app_id = "${mysql.escape(req.body.app_id)}" AND invite_email = "${mysql.escape(req.body.invite_email)}")`)
    const owner = await awaitQuery(`SELECT * FROM AppUsers LEFT JOIN Applications ON AppUsers.user_id = Applications.user_id WHERE invite_email = "${mysql.escape(req.body.invite_email)}"`)
    if (users.length === 0 && owner.length === 0)
    {
        insertInto(["app_id", "invite_email", "role"], [], "AppUsers", req, res, next);
    }
    else
    {
        res.send({ msg: "User already has a role or invitation for this application"})
    }
});

router.put('/invites/:invite_id', cors(corsOptions), async function(req, res, next) {
    const response = await update(req.body, ["invite_status", "user_id"], "AppUsers", req.params.invite_id);
    res.send(`Updated invite ${req.params.invite_id} with status "${req.body.invite_status}": ${JSON.stringify(response)}`);
});

// TODO: Verify the user has sufficient permissions to do these
router.delete('/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    deleteEntry("AppUsers", id, req, res, next);
});
router.delete('/invites/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    deleteEntry("AppUsers", id, req, res, next);
});
router.delete('/apps/:app_id/users/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    const app_id = req.params.app_id;
    if (user_id === undefined)
    {
        res.send({"msg": "User not specified"});
        return;
    }
    awaitQuery(`DELETE FROM AppUsers WHERE user_id = "${mysql.escape(user_id)}" AND app_id = "${mysql.escape(app_id)}"`);
    res.send({ "msg": `Role for user ${user_id} for app ${app_id} deleted.`})
});

module.exports = router;