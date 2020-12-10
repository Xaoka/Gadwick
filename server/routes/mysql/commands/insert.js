
const { makeQuery } = require('./mysql');
const { v4: uuidv4 } = require('uuid');

function insertInto(allowedKeys, table, req, res, next)
{
    const userData = req.body;
    for (const key of allowedKeys)
    {
        if (userData[key] === undefined) { next({ message: `Missing field '${key}'`}); return; }
    }
    for (const key of Object.keys(userData))
    {
        if (!allowedKeys.includes(key)) { next({ message: `Erroneous field '${key}'`}); return; }
    }
    userData.id = uuidv4();
    // E.G. "INSERT INTO Results (version, passed, id) VALUES ('0.1.0', 'true', '1605638481223')"
    const query = `INSERT INTO ${table} (${Object.keys(userData).join(", ")}) VALUES (${Object.values(userData).map((v) => `'${v}'`).join(", ")})`;
    
    makeQuery(query, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send({ id: userData.id });
    });
}

module.exports = { insertInto };