var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { makeQuery, awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');

router.get('/', cors(corsOptions), function(req, res, next) {
    makeQuery("SELECT * FROM Features", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/priority/:user_id', cors(corsOptions), async function(req, res, next) {
    // TODO: This needs to filter where there aren't any automated results
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Features F LEFT JOIN (SELECT id app_id, user_id FROM Applications WHERE user_id = "${user_id}") AS Apps ON F.app_id = Apps.app_id ORDER BY ((F.use_frequency * F.severity) + (F.fix_priority * F.distinctness) + (F.time_cost * F.ease) + (F.problem_frequency * F.similar_problem_frequency)) DESC LIMIT 10 `);
    
    res.send(response);
});
// TODO: Make the endpoint path references consistent - this is by app, others are feature ID
router.get('/:app_id', cors(corsOptions), function(req, res, next) {
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
    insertInto(["name", "description", "app_id", "thirdparty_id", "thirdparty_provider", "thirdparty_board", "thirdparty_link"], "Features", req, res, next);
})

router.put('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    const userData = req.body;
    const optionalFields = ["name", "description", "use_frequency", "severity", "distinctness", "fix_priority", "ease", "time_cost", "similar_problem_frequency", "problem_frequency"];
    const sqlFields = [];
    for (const field of optionalFields)
    {
        if (userData[field])
        {
            sqlFields.push(`${field} = '${userData[field]}'`)
        }
    }
    if (sqlFields.length === 0) { res.send({ error: "No fields set" }); return; }
    makeQuery(`UPDATE Features SET ${sqlFields.join(", ")} WHERE id = ${id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
})

router.delete('/:id', cors(corsOptions), function(req, res, next) {
    const id = req.params.id;
    makeQuery(`DELETE FROM Features WHERE id = ${id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
})

module.exports = router;