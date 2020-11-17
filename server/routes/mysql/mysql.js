var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : "gadwick-db.coqc02b1gisw.eu-west-2.rds.amazonaws.com",//process.env.RDS_HOSTNAME,
    user     : "admin",//process.env.RDS_USERNAME,
    password : "mysqladmin",//process.env.RDS_PASSWORD,
    port     : 3306//process.env.RDS_PORT
  });
connection.connect(function(err) {
if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
}

console.log('Connected to database.');
connection.query(`USE gadwick`)
});

function makeQuery(query, callback)
{
    connection.query(query, callback);
}

module.exports = { makeQuery };