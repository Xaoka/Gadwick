
const { makeQuery } = require('./mysql');
const { v4: uuidv4 } = require('uuid');

function insertInto(allowedKeys, optionalKeys, table, req, res, next)
{
    const userData = req.body;
    for (const key of allowedKeys)
    {
        if (userData[key] === undefined) { next({ message: `Missing field '${key}'`}); return; }
    }
    for (const key of Object.keys(userData))
    {
        if (!allowedKeys.includes(key) && !optionalKeys.includes(key))
        {
            next({ message: `Erroneous field '${key}'`});
            return;
        }
    }
    const entryID = uuidv4();
    console.log(`Inserting with ID: ${entryID}`)
    console.log(Object.entries(userData).map((e) => `"${e[0]}" = "${e[1]}"`));
    // E.G. "INSERT INTO Results (version, passed, id) VALUES ('0.1.0', 'true', '1605638481223')"
    const query = `INSERT INTO ${table} (id, ${Object.keys(userData).join(", ")}) VALUES ('${entryID}', ${Object.values(userData).map((v) => `'${v}'`).join(", ")})`;
    console.log(`QUERY:`)
    console.log("\x1b[32m%s\x1b[0m", query);
    
    makeQuery(query, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send({ id: entryID });
    });
}

module.exports = { insertInto };