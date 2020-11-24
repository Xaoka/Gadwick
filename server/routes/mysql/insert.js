
const { makeQuery } = require('./mysql');

function insertInto(allowedKeys, table, req, res)
{
    const userData = req.body;
    for (const key of allowedKeys)
    {
        if (userData[key] === undefined) { res.send({ error: `Missing field '${key}'`}); return; }
    }
    for (const key of Object.keys(userData))
    {
        if (!allowedKeys.includes(key)) { res.send({ error: `Erroneous field '${key}'`}); return; }
    }
    var uniqueID = Date.now();
    userData.id = uniqueID;
    // E.G. "INSERT INTO Results (version, passed, id) VALUES ('0.1.0', 'true', '1605638481223')"
    const query = `INSERT INTO ${table} (${Object.keys(userData).join(", ")}) VALUES (${Object.values(userData).map((v) => `'${v}'`).join(", ")})`;
    console.log(`Query: "${query}"`)
    makeQuery(query, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send({ id: uniqueID });
    });
}

module.exports = { insertInto };