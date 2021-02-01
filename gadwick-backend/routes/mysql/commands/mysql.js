var mysql = require('mysql');
const util = require('util');
const config = require('dotenv').config();


const pool = mysql.createPool({
    connectionLimit: 10,
    host     : process.env.DB_HOST || process.env.SLS_DB_HOST,
    user     : process.env.DB_USER || process.env.SLS_DB_USER,
    password : process.env.DB_PASSWORD || process.env.SLS_DB_PASSWORD,
    port     : process.env.DB_PORT || process.env.SLS_DB_PORT,
    database : "gadwick"
});

// let connection;
// function createConnection()
// {
//     connection = mysql.createConnection({
//         host     : process.env.DB_HOST || process.env.SLS_DB_HOST,
//         user     : process.env.DB_USER || process.env.SLS_DB_USER,
//         password : process.env.DB_PASSWORD || process.env.SLS_DB_PASSWORD,
//         port     : process.env.DB_PORT || process.env.SLS_DB_PORT,
//         database : "gadwick"
//     });
// }

// function connectToDatabase()
// {
//     createConnection();
//     connection.connect(function(err) {
//         if (err) {
//             console.error('Database connection failed: ' + err.stack);
//             return;
//         }
    
//         console.log('Connected to database.');
//     });
//     connection.on('error', function(err) {
//         if (!err.fatal) {
//           return;
//         }
    
//         if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
//           throw err;
//         }
    
//         console.log('Re-connecting lost connection: ' + err.message);
    
//         connectToDatabase();
//     });
//     // connection.on('end',() =>
//     // {
//     //     // connectToDatabase();
//     // })
// }
// connectToDatabase();

// escapeID: https://stackoverflow.com/questions/57598136/error-er-no-db-error-no-database-selected-node-js-mysql-when-always-using
// https://stackoverflow.com/questions/15778572/preventing-sql-injection-in-node-js
function awaitQuery(query)
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            pool.query(query, (error, results, fields) =>
            {
                if (error)
                {
                    // console.log(`\x1b[31m%s\x1b[0m`,`Problem resolving query:\n${query}\n\n`);
                    // reject(error)
                    resolve({ error: `Issue Resolving your query: ${error}`})
                }
                resolve(results);
            })
        }
        catch (e)
        {
            console.error(e);
            resolve({ error: "Database Connection Failure"})
        }
    })
}

module.exports = { awaitQuery };