var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');

router.get('/auth/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const user = (await awaitQuery(`SELECT * FROM Users WHERE auth_id = '${id}'`));
    res.send(user)
});
router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const user = (await awaitQuery(`SELECT * FROM Users WHERE id = '${id}'`))[0];
    res.send(user)
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["name", "auth_id", "auth_service"], [], "Users", req, res, next);
});

module.exports = router;