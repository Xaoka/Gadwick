var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const config = require('../../config.json');

router.get('/', cors(corsOptions), async function(req, res, next) {
    // const response = await awaitQuery("SELECT * FROM Results LEFT JOIN Features ON Results.feature_id = Features.id");
    // res.send(response);
    next(`Unsupported`);
});
router.get('/subscriptions', cors(corsOptions), async function(req, res, next) {
    const response = await awaitQuery(`SELECT * FROM Products WHERE type = 'SUBSCRIPTION' AND env = ${config.ENV}`);
    res.send(response);
});

module.exports = router;