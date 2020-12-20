var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { makeQuery, awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');

router.get('/', cors(corsOptions), function(req, res, next) {
    const ids = (req.query.id || req.query.ids).split(",");
    console.log(ids);
    const idQuery = ids ? `WHERE ${ids.map((id) => `id = "${id}"`).join(" OR ")}` : "";

    makeQuery(`SELECT * FROM Features LEFT JOIN (SELECT id app_id, name app_name FROM Applications) Apps ON Features.app_id = Apps.app_id ${idQuery}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/priority/:user_id', cors(corsOptions), async function(req, res, next) {
    // TODO: This needs to filter where there aren't any automated results
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Features F LEFT JOIN (SELECT id app_id, name app_name, user_id FROM Applications WHERE user_id = "${user_id}") AS Apps ON F.app_id = Apps.app_id WHERE F.id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL GROUP BY feature_id) ORDER BY F.priority DESC LIMIT 10 `);
    
    res.send(response);
});

router.get('/app/:app_id', cors(corsOptions), function(req, res, next) {
    const id = req.params.app_id;
    makeQuery(`SELECT * FROM Features WHERE app_id = ${id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/s/:client_secret', cors(corsOptions), function(req, res, next) {
    const client_secret = req.params.client_secret;
    console.log(client_secret)
    makeQuery(`SELECT * FROM Features LEFT JOIN (SELECT id app_id, client_secret FROM Applications) AS Apps ON Features.app_id = Apps.app_id WHERE Apps.client_secret = "${client_secret}"`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});


router.post('/', cors(corsOptions), function(req, res, next) {
    insertInto(["name", "description", "app_id"], ["thirdparty_id", "thirdparty_provider", "thirdparty_board", "thirdparty_link"], "Features", req, res, next);
})

router.put('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    const userData = req.body;
    const optionalFields = ["name", "description", "use_frequency", "severity", "distinctness", "fix_priority", "ease", "time_cost", "similar_problem_frequency", "problem_frequency", "steps"];
    
    const response = update(userData, optionalFields, "Features", id);
    res.send(response)
})

// TODO: what should happen to sessions and results here?
router.delete('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    deleteEntry("Features", id);
    deleteEntry("Results", id, "feature_id");
})

module.exports = router;