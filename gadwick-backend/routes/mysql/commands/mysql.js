var mysql = require('mysql');
const util = require('util');

var connection = mysql.createConnection({
    host     : "gadwick-db.coqc02b1gisw.eu-west-2.rds.amazonaws.com",//process.env.RDS_HOSTNAME,
    user     : "admin",//process.env.RDS_USERNAME,
    password : "mysqladmin",//process.env.RDS_PASSWORD,
    port     : 3306//process.env.RDS_PORT
  });

function connectToDatabase()
{
    connection.connect(function(err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
    
        console.log('Connected to database.');
        connection.query(`USE gadwick`)
    });
    connection.on('error', function(err) {
        if (!err.fatal) {
          return;
        }
    
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
          throw err;
        }
    
        console.log('Re-connecting lost connection: ' + err.stack);
    
        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connectToDatabase();
    });
    connection.on('end',() =>
    {
        connectToDatabase();
    })
}
connectToDatabase();

// TODO: !! Use post and actual sanitization rather than our own injection thing:
// TODO: escapeID: https://stackoverflow.com/questions/57598136/error-er-no-db-error-no-database-selected-node-js-mysql-when-always-using
// https://stackoverflow.com/questions/15778572/preventing-sql-injection-in-node-js
function awaitQuery(query)
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            connection.query(query, (error, results, fields) =>
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