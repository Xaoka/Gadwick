function validate(data, allowedKeys, optionalKeys) {
    for (const key of allowedKeys)
    {
        if (data[key] === undefined) { throw new Error(`Missing field '${key}'`); }
    }
    for (const key of Object.keys(data))
    {
        if (!allowedKeys.includes(key) && !optionalKeys.includes(key))
        {
            throw new Error(`Erroneous field '${key}'`);
        }
    }
}

module.exports = { validate }