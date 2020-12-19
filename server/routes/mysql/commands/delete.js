const { awaitQuery } = require('./mysql');

async function deleteEntry(tableName, entryID, field="id")
{
    // TODO: Clean SQL before insert
    const response = awaitQuery(`DELETE FROM ${tableName} WHERE ${field} = "${entryID}"`);
    return response;
}

module.exports = { deleteEntry }