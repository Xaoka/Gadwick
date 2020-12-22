var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');

router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["app_id", "user_id", "role"], [], "AppUsers", req, res, next);
});

router.get('/app/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const roles = (await awaitQuery(`SELECT * FROM AppUsers WHERE app_id = '${id}' AND invite_status = "Accepted"`));
    res.send(roles)
});

router.get('/invites/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const invites = (await awaitQuery(`SELECT * FROM AppUsers LEFT JOIN (SELECT id user_id, name FROM Users) U ON AppUsers.user_id = U.user_id WHERE app_id = '${id}' AND invite_status = "Invited"`));
    res.send(invites)
});

router.post('/invites', cors(corsOptions), async function(req, res, next) {
    insertInto(["app_id", "invite_email", "role"], [], "AppUsers", req, res, next);
});

router.put('/invites/:invite_id', cors(corsOptions), async function(req, res, next) {
    const response = update(req.body, ["invite_status", "user_id"], "AppUsers", req.params.invite_id);
    res.send(response);
});

router.delete('/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    deleteEntry("AppUsers", id, req, res, next);
});
router.delete('/invites/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    deleteEntry("AppUsers", id, req, res, next);
});

module.exports = router;