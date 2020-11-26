var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./mysql');

router.get('/', cors(corsOptions), async function(req, res, next) {
    const featureCount = (await awaitQuery(`SELECT COUNT(*) featureCount FROM Features`))[0].featureCount;
    const failedCount = (await awaitQuery(`SELECT COUNT(*) failedCount FROM Results WHERE STRCMP(passed, "true")`))[0].failedCount;
    const untestedCount = (await awaitQuery(`SELECT COUNT(*) untested FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id)`))[0].untested;
    res.send({ featureCount, failedCount, untestedCount });
});

module.exports = router;