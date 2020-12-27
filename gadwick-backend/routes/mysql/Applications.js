var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { v4: uuidv4 } = require('uuid');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    let applications, shared, invites;
    try
    {
        const id = req.params.user_id;
        applications = (await awaitQuery(`SELECT * FROM Applications WHERE user_id = "${id}"`));
        const inviteBaseQuery = `SELECT * FROM Applications LEFT JOIN (SELECT app_id, invite_email, invite_status FROM AppUsers) AU ON Applications.id = AU.app_id LEFT JOIN (SELECT email, id users_user_id FROM Users) U ON U.email = AU.invite_email WHERE U.users_user_id = "${id}"`;
        shared = (await awaitQuery(`${inviteBaseQuery} AND invite_status = "Accepted"`));
        invites = (await awaitQuery(`${inviteBaseQuery} AND invite_status = "Invited"`));
    }
    catch (err)
    {
        next(`Applications Error: ${err}`);
        return;
    }
    res.send({ applications, shared, invites });
});
router.get('/', cors(corsOptions), async function(req, res, next) {
    res.send(`Server is up, but something else is going wrong`)
})

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.client_secret = uuidv4();
    insertInto(["name", "user_id", "client_secret", "description"], ["feature_ids"], "Applications", req, res, next);
});

router.put('/:app_id', cors(corsOptions), async function(req, res, next) {
    const app_id = req.params.app_id;
    update(req.body, ["name", "description"], "Applications", app_id)
});

router.delete('/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    deleteEntry("Applications", id, req, res, next);
    // TODO: Cleanup any features and results and invites associated with an app
    //      We will need to handle what if another user is mid-process?
})

module.exports = router;