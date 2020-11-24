var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { makeQuery } = require('./mysql');
const { insertInto } = require('./insert');

router.get('/', cors(corsOptions), function(req, res, next) {
    makeQuery("SELECT * FROM Features", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
router.post('/', cors(corsOptions), function(req, res, next) {
    insertInto(["name", "description"], "Features", req, res);
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