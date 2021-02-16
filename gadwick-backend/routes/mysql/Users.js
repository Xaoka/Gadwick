var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const { v4: uuidv4 } = require('uuid');
var mysql = require('mysql');

router.get('/auth/:auth_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.auth_id;
    const user = (await awaitQuery(`SELECT name, id, email FROM Users WHERE auth_id = ${mysql.escape(id)}`));
    res.send(user)
});
router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const user = (await awaitQuery(`SELECT name, id, email FROM Users WHERE id = ${mysql.escape(id)}`))[0];
    res.send(user)
});
router.get('/', cors(corsOptions), async function(req, res, next) {
    console.log(`Test log`)
    const user = (await awaitQuery(`SELECT name, id, email FROM Users ORDER BY email`));
    res.send(user)
});
router.get('/apps/all', cors(corsOptions), async function(req, res, next) {
    // console.log(`Getting apps...`)
    const apps = await awaitQuery(`SELECT Users.name user_name, Applications.name app_name, description, email FROM Applications LEFT JOIN Users ON user_id = Users.id WHERE email IS NOT NULL ORDER BY email`);
    // console.log(`Apps:`)
    // console.dir(apps);
    res.send(apps)
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["name", "auth_id", "auth_service", "email"], [], "Users", req, res, next);
});
router.put('/:user_id', cors(corsOptions), async function(req, res, next) {
    const response = await update(req.body, ["name"], req.params.user_id);
    res.send({ "message": `Updated ${user_id}`});
});
router.post('/key/:user_id', cors(corsOptions), async function(req, res, next) {
    const newSecret = uuidv4();
    await update({api_key: newSecret}, ["api_key"], "Users", req.params.user_id);
    res.send({ api_key: newSecret });
});
router.get('/key/:api_key', cors(corsOptions), async function(req, res, next) {
    const id = req.params.api_key;
    const user = (await awaitQuery(`SELECT name, id, email FROM Users WHERE api_key = ${mysql.escape(id)}`));
    console.dir(user);
    if (user)
    {
        res.send(user);
    }
    else
    {
        res.sendStatus(404);
    }
});

module.exports = router;