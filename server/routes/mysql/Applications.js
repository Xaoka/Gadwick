var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./mysql');
const { insertInto } = require('./insert');
const { v4: uuidv4 } = require('uuid');

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.user_id;
    const applications = (await awaitQuery(`SELECT * FROM Applications WHERE user_id = ${id}`));
    res.send(applications)
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.client_secret = uuidv4();
    insertInto(["name", "user_id", "client_secret", "description"], "Applications", req, res, next);
});
router.delete('/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const result = await awaitQuery(`DELETE FROM Applications WHERE id = ${id}`);
    res.send(result);
    // TODO: Cleanup any features and results associated with an app
})

module.exports = router;