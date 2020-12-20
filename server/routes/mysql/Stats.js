var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');

router.get('/', cors(corsOptions), async function(req, res, next) {
    const featureCount = (await awaitQuery(`SELECT COUNT(*) featureCount FROM Features`))[0].featureCount;
    const failedCount = (await awaitQuery(`SELECT COUNT(*) failedCount FROM Results WHERE STRCMP(passed, "true")`))[0].failedCount;
    const untestedCount = (await awaitQuery(`SELECT COUNT(*) untested FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id)`))[0].untested;
    res.send({ featureCount, failedCount, untestedCount });
});

router.get('/automation', cors(corsOptions), async function(req, res, next) {
    const stats = await getAutomationStats();
    res.send(stats);
});

router.get('/automation/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const stats = await getAutomationStats(`AND app_id = "${id}"`);
    res.send(stats);
});

async function getAutomationStats(idSQL = "")
{
    // TODO: Work out how to make this all one query
    const automated = (await awaitQuery(`SELECT COUNT(*) automated FROM Features WHERE id IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) ${idSQL}`))[0].automated;
    const important = (await awaitQuery(`SELECT COUNT(*) important FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) AND priority > 55 ${idSQL}`))[0].important;
    const possible = (await awaitQuery(`SELECT COUNT(*) possible FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) AND priority > 35 AND priority <= 55 ${idSQL}`))[0].possible;
    const not_worth = (await awaitQuery(`SELECT COUNT(*) not_worth FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) AND priority <= 35 AND priority > 0 ${idSQL}`))[0].not_worth;
    // TODO: This should actually check each field is not 0
    const not_configured = (await awaitQuery(`SELECT COUNT(*) not_configured FROM Features WHERE id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) AND priority < 5 ${idSQL}`))[0].not_configured;
    return { automated, important, possible, not_worth, not_configured };
}

module.exports = router;