
const { awaitQuery } = require('./mysql');
const { v4: uuidv4 } = require('uuid');
var mysql = require('mysql');
const { validate } = require('../validate');

async function insertInto(allowedKeys, optionalKeys, table, req, res, next)
{
    const userData = req.body;
    if (!req.body)
    {
        next(`No body.`);
        return;
    }

    // TODO: abstract this into a function that just takes an SQL create callback?
    let query;
    try {
        query = createInsertSQL(allowedKeys, optionalKeys, table, userData);
    }
    catch (e)
    {
        next(e.getMessage());
        return;
    }
    
    const response = await awaitQuery(query);
    if (response.error)
    {
        res.send({ response });
        return;
    }
    res.send({ id: entryID, response });
}

/** Creates a bulk insert SQL statement and runs it against the table as one query. Returns HTTP400 if any data is invalid. */
async function bulkInsertInto(allowedKeys, table, req, res, next)
{
    const dataArray = req.body;
    let query = "";
    try {
        query = createBulkInsertSQL(allowedKeys, table, dataArray);
        console.log(`Bulk Query:\n${query}`);
    }
    catch (e)
    {
        next(e);
        return;
    }
    const response = await awaitQuery(query);
    if (response.error)
    {
        res.send({ response });
        return;
    }
    res.send({ id: "", response });
}

/** Creates an SQL insert statement, or throws an exception if the data is invalid */
function createInsertSQL(allowedKeys, optionalKeys, table, data)
{
    validate(data, allowedKeys, optionalKeys);

    const entryID = uuidv4();
    console.log(`Creating insert statement with ID: ${entryID}`)
    console.log(Object.entries(data).map((e) => `"${e[0]}" = "${e[1]}"`));
    const query = `INSERT INTO ${table} (id, ${Object.keys(data).map(mysql.escapeId).join(", ")}) VALUES (${mysql.escape(entryID)}, ${Object.values(data).map((v) => `${mysql.escape(v)}`).join(", ")}); `;
    console.log(`QUERY:`)
    console.log("\x1b[32m%s\x1b[0m", query);
    return query;
}

function createBulkInsertSQL(allowedKeys, table, data)
{
    for (const entry of data) {
        validate(entry, allowedKeys, []);
    }
    
    const columns = allowedKeys.map(mysql.escapeId).join(", ");
    const valuesList = [];
    for (const entry of data) {
        const entryID = uuidv4();
        valuesList.push(`(${mysql.escape(entryID)}, ${Object.values(entry).map((v) => `${mysql.escape(v)}`).join(", ")})`);
    }
    const query = `INSERT INTO ${table} (id, ${columns}) VALUES ${valuesList.join()};`;
    console.log(`QUERY:`)
    console.log("\x1b[32m%s\x1b[0m", query);
    return query;
}

module.exports = { insertInto, bulkInsertInto };