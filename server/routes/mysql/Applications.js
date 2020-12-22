var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { v4: uuidv4 } = require('uuid');

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const applications = (await awaitQuery(`SELECT * FROM Applications WHERE user_id = "${id}"`));
    const inviteBaseQuery = `SELECT * FROM Applications LEFT JOIN (SELECT app_id, invite_email, invite_status FROM AppUsers) AU ON Applications.id = AU.app_id LEFT JOIN (SELECT email, id users_user_id FROM Users) U ON U.email = AU.invite_email WHERE U.users_user_id = "${id}"`;
    const shared = (await awaitQuery(`${inviteBaseQuery} AND invite_status = "Accepted"`));
    const invites = (await awaitQuery(`${inviteBaseQuery} AND invite_status = "Invited"`));
    res.send({ applications, shared, invites });
});

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.client_secret = uuidv4();
    insertInto(["name", "user_id", "client_secret", "description"], ["feature_ids"], "Applications", req, res, next);
});
router.delete('/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const result = await awaitQuery(`DELETE FROM Applications WHERE id = ${id}`);
    res.send(result);
    // TODO: Cleanup any features and results associated with an app
})

module.exports = router;