var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { v4: uuidv4 } = require('uuid');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');
var mysql = require('mysql');

router.get('/:app_id', cors(corsOptions), async function(req, res, next) {
    const app_id = req.params.app_id;
    applications = (await awaitQuery(`SELECT * FROM Applications WHERE id = ${mysql.escape(app_id)}`));
    if (applications.length === 0)
    {
        res.sendStatus(404);
        return;
    }
    res.send(applications[0]);
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.client_secret = uuidv4();
    insertInto(["name", "user_id", "client_secret", "description"], ["feature_ids"], "Applications", req, res, next);
});
router.put('/:app_id', cors(corsOptions), async function(req, res, next) {
    const app_id = req.params.app_id;
    update(req.body, ["name", "description"], "Applications", app_id)
    res.send(`Updated app`);
});
router.delete('/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    deleteEntry("Applications", id, req, res, next);
    // TODO: Cleanup any features and results and invites associated with an app
    //      We will need to handle what if another user is mid-process?
})

router.get('/user/:user_id', cors(corsOptions), async function(req, res, next) {
    let applications, shared, invites;
    try
    {
        const id = req.params.user_id;
        applications = (await awaitQuery(`SELECT * FROM Applications WHERE user_id = "${mysql.escape(id)}"`));
        const inviteBaseQuery = `SELECT * FROM Applications LEFT JOIN (SELECT app_id, invite_email, invite_status, id invite_id, role FROM AppUsers) AU ON Applications.id = AU.app_id LEFT JOIN (SELECT email, id users_user_id FROM Users) U ON U.email = AU.invite_email WHERE U.users_user_id = "${mysql.escape(id)}"`;
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



router.get('/versions/:app_id', cors(corsOptions), async function(req, res, next) {
    const response = await awaitQuery(`SELECT version From Results GROUP BY version`)
    res.send(response);
})

module.exports = router;