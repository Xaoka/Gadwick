
const { awaitQuery } = require('./mysql');
const { v4: uuidv4 } = require('uuid');
var mysql = require('mysql');

async function insertInto(allowedKeys, optionalKeys, table, req, res, next)
{
    const userData = req.body;
    if (!req.body)
    {
        next(`No body.`);
        return;
    }
    for (const key of allowedKeys)
    {
        if (userData[key] === undefined) { next(`Missing field '${key}'`); return; }
    }
    for (const key of Object.keys(userData))
    {
        if (!allowedKeys.includes(key) && !optionalKeys.includes(key))
        {
            next(`Erroneous field '${key}'`);
            return;
        }
    }
    const entryID = uuidv4();
    console.log(`Inserting with ID: ${entryID}`)
    console.log(Object.entries(userData).map((e) => `"${e[0]}" = "${e[1]}"`));
    // E.G. "INSERT INTO Results (version, passed, id) VALUES ('0.1.0', 'true', '1605638481223')"
    const query = `INSERT INTO ${table} (id, ${Object.keys(userData).join(", ")}) VALUES ('${mysql.escape(entryID)}', ${Object.values(userData).map((v) => `'${mysql.escape(v)}'`).join(", ")})`;
    console.log(`QUERY:`)
    console.log("\x1b[32m%s\x1b[0m", query);
    
    const response = await awaitQuery(query);
    if (response.error)
    {
        res.send({ response });
        return;
    }
    res.send({ id: entryID, response });
}

module.exports = { insertInto };