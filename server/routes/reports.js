var express = require('express');
var cors = require('cors')
var corsOptions = require('./cors')
var router = express.Router();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-2'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'big-books'});
AWS.config.credentials = credentials;
var packAWSData = require('../utils/AWSPack');

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/* GET reports listing. */
router.get('/', cors(corsOptions), function(req, res, next) {

    ddb.scan({ TableName: 'TestReports' }, (err, data) =>
    {
      if (err) {
        res.send({ "msg": "Error", "data": data});
        return;
      }
  
      // Does AWS provide an extraction method?
      data.Items.forEach((item) =>
      {
        for (const key of Object.keys(item))
        {
          item[key] = item[key].S || item[key].N;
        }
      })
      res.send({ "msg": "Success", "data": data.Items});
    })
})
/* POST new report. */
router.post('/', cors(corsOptions), async function(req, res, next) {
    // { report, results }

    // Post a new report entry
    const expressionKeys =
    [
        {
            dbKey: "utc_date",
            shorthand: ":d",
            dynamoType: "N"
        },
        {
            dbKey: "version_major",
            shorthand: ":m",
            dynamoType: "N"
        }
    ]
    const reportData = req.body.report;
    var uniqueID = Date.now();
    var params = {
      TableName: 'TestReports',
      Item: { "id": {"S": `${uniqueID}`}, ...packAWSData(reportData, expressionKeys) }
    };
    await ddb.putItem(params).promise()//, (err, data) => res.send({ msg: "Success", data: { 'id': uniqueID }, error: err }))

    // Post all the test results
    const testExpressionKeys =
    [
        {
            dbKey: "feature_id",
            shorthand: ":i",
            dynamoType: "S"
        },
        {
            dbKey: "passed",
            shorthand: ":p",
            dynamoType: "BOOL"
        },
        {
            dbKey: "report_id",
            shorthand: ":r",
            dynamoType: "S"
        }
    ]
    const testResults = req.body.results;
    for (const result of testResults)
    {
        var uniqueResultID = Date.now();
        result.report_id = uniqueID;
        var params = {
          TableName: 'TestResults',
          Item: { "id": {"S": `${uniqueResultID}`}, ...packAWSData(result, testExpressionKeys) }
        };
        await ddb.putItem(params).promise()//, (err, data) => console.log(`Posted test result`)/*res.send({ msg: "Success", data: { 'id': uniqueID }, error: err })*/)
    }
    res.send({ msg: "Success", data: { 'id': uniqueID } })
})

module.exports = router;