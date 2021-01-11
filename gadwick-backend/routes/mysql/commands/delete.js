const { awaitQuery } = require('./mysql');

async function deleteEntry(tableName, entryID, req, res, next, field="id", noSend=false)
{
    // TODO: Clean SQL before insert
    const response = awaitQuery(`DELETE FROM ${tableName} WHERE ${field} = "${entryID}"`);
    if (!noSend)
    {
        res.send({ "msg": `${entryID} deleted.`});
    }
}

module.exports = { deleteEntry }