const { awaitQuery } = require('./mysql');

async function update(userData, optionalFields, tableName, entryID)
{
    const sqlFields = [];
    for (const field of optionalFields)
    {
        if (userData[field])
        {
            sqlFields.push(`${field} = '${userData[field]}'`)
        }
    }
    if (sqlFields.length === 0) { res.send({ error: "No fields set" }); return; }
    const response = await awaitQuery(`UPDATE ${tableName} SET ${sqlFields.join(", ")} WHERE id = '${entryID}'`)
    return response;
}

module.exports = { update }