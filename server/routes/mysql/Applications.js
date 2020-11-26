var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./mysql');
const { insertInto } = require('./insert');

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const applications = (await awaitQuery(`SELECT * FROM Applications WHERE user_id = ${id}`));
    res.send(applications)
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["name", "user_id"], "Applications", req, res);
});

module.exports = router;