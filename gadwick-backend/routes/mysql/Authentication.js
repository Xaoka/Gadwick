var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const { v4: uuidv4 } = require('uuid');
var mysql = require('mysql');

router.get('/:service/:user_id', cors(corsOptions), async function(req, res, next) {
    const service = req.params.service;
    const id = req.params.user_id;
    const authEntries = (await awaitQuery(`SELECT * FROM Authentication WHERE service = ${mysql.escape(service)} AND user_id = ${mysql.escape(id)}`));
    if (authEntries.length > 0)
    {
        res.send(authEntries[0]) 
    }
    else
    {
        res.sendStatus(404);
    }
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["service", "user_id", "token"], [], "Authentication", req, res, next);
})

module.exports = router;