const { awaitQuery } = require('./mysql');

async function update(userData, optionalFields, tableName, entryID)
{
    const sqlFields = [];
    for (const field of optionalFields)
    {
        if (userData[field])
        {
            // TODO: Should not be rolling our own sanitization here! Use the official API
            const value = userData[field].length ? userData[field].replace("'","\\'").replace(`"`, `\\"`) : userData[field];
            sqlFields.push(`${field} = '${value}'`)
        }
    }
    if (sqlFields.length === 0) { return { error: "No fields set" }; }
    const response = await awaitQuery(`UPDATE ${tableName} SET ${sqlFields.join(", ")} WHERE id = "${entryID}"`)
    return response;
}

module.exports = { update }