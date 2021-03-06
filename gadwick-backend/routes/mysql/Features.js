var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto, bulkInsertInto } = require('./commands/insert');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');
var mysql = require('mysql');

router.get('/', cors(corsOptions), async function(req, res, next) {
    const idString = (req.query.id || req.query.ids);
    if (!idString) { res.status(400).send("Neither 'id' or 'ids' was defined"); return }
    const ids = idString.split(",");
    console.log(ids);
    const idQuery = ids ? `WHERE ${ids.map((id) => `id = ${mysql.escape(id)}`).join(" OR ")}` : "";

    const response = await awaitQuery(`SELECT * FROM Features LEFT JOIN (SELECT id app_id, name app_name FROM Applications) Apps ON Features.app_id = Apps.app_id ${idQuery}`);
    if (response.length === 0)
    {
        res.sendStatus(404);
        return;
    }
    res.send(response);
});

router.get('/priority/:user_id', cors(corsOptions), async function(req, res, next) {
    // TODO: This needs to filter where there aren't any automated results
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Features F LEFT JOIN (SELECT id app_id, name app_name, user_id FROM Applications) AS Apps ON F.app_id = Apps.app_id WHERE F.id NOT IN (SELECT feature_id id FROM Results WHERE feature_id IS NOT NULL AND STRCMP(automated, "FALSE") GROUP BY feature_id) AND user_id = ${mysql.escape(user_id)} ORDER BY F.priority DESC LIMIT 10 `);
    
    res.send(response);
});

router.get('/app/:app_id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.app_id;
    const response = await awaitQuery(`SELECT * FROM Features WHERE app_id = ${mysql.escape(id)}`);
    res.send(response);
});

router.get('/s/:client_secret', cors(corsOptions), async function(req, res, next) {
    const client_secret = req.params.client_secret;
    console.log(client_secret)
    const response = await awaitQuery(`SELECT * FROM Features LEFT JOIN (SELECT id app_id, client_secret FROM Applications) AS Apps ON Features.app_id = Apps.app_id WHERE Apps.client_secret = ${mysql.escape(client_secret)}`);
    res.send(response);
});

router.post('/', cors(corsOptions), function(req, res, next) {
    insertInto(["name", "description", "app_id"], ["thirdparty_id", "thirdparty_provider", "thirdparty_board", "thirdparty_link"], "Features", req, res, next);
})

router.post('/bulk', cors(corsOptions), function(req, res, next) {
    let invalid = false;
    let featureArray = req.body;
    // try {
    //     featureArray = JSON.parse(body);
    // }
    // catch (e) {
    //     invalid = true;
    // }

    if (!Array.isArray(featureArray)) {
        invalid = true;
    }
    else {
        for (const featureObject of featureArray) {
            if (typeof featureObject !== "object") {
                invalid = true;
                break;
            }
            else if (featureObject.app_id == null || featureObject.name == null) {
                invalid = true;
                break;
            }
        }
    }
    if (invalid) {
        res.status(400).send("Request body must be an array of feature objects.");
        return;
    }
    bulkInsertInto(["name", "app_id"], "Features", req, res, next);

    //insertInto(["name", "description", "app_id"], ["thirdparty_id", "thirdparty_provider", "thirdparty_board", "thirdparty_link"], "Features", req, res, next);
})

router.post('/s/:app_secret', cors(corsOptions), async function(req, res, next) {
    if (!req.body.name)
    {
        res.sendStatus(400);
        return;
    }
    const features = await awaitQuery(`SELECT id FROM Features WHERE name = ${mysql.escape(req.body.name)}`);

    if (features.length > 0)
    {
        res.status(302).send({id: features[0].id});
        return;
    }

    const app_secret = req.params.app_secret;
    const app_ids = await awaitQuery(`SELECT id FROM Applications WHERE client_secret = ${mysql.escape(app_secret)}`);
    console.log(`Fetching app for secret ${app_secret}: ${app_ids.join()}`)
    if (app_ids.length === 0)
    {
        res.sendStatus(404);
        return;
    }
    req.body.app_id = app_ids[0].id;
    insertInto(["name", "description", "app_id"], ["thirdparty_id", "thirdparty_provider", "thirdparty_board", "thirdparty_link"], "Features", req, res, next);
})

router.put('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    const userData = req.body;
    const optionalFields = ["name", "description", "use_frequency", "severity", "distinctness", "fix_priority", "ease", "time_cost", "similar_problem_frequency", "problem_frequency", "steps", "tag"];
    
    const response = update(userData, optionalFields, "Features", id);
    res.send(response)
})

// TODO: what should happen to sessions and results here?
router.delete('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    deleteEntry("Features", id, req, res, next);
    deleteEntry("Results", id, req, res, next, "feature_id", "id", true);
})

module.exports = router;