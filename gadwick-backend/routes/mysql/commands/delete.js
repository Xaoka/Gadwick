const { awaitQuery } = require('./mysql');
var mysql = require('mysql');

async function deleteEntry(tableName, entryID, req, res, next, field="id", noSend=false)
{
    // TODO: Clean SQL before insert
    const response = awaitQuery(`DELETE FROM ${tableName} WHERE ${field} = "${mysql.escape(entryID)}"`);
    if (!noSend)
    {
        res.send({ "msg": `${entryID} deleted.`});
    }
}

module.exports = { deleteEntry }