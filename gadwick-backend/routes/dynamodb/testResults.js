var express = require('express');
var cors = require('cors')
var corsOptions = require('./cors')
var router = express.Router();
var packAWSData = require('../utils/AWSPack');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-2'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'big-books'});
AWS.config.credentials = credentials;

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/* GET reports listing. */
router.get('/', cors(corsOptions), function(req, res, next) {

    ddb.scan({ TableName: 'TestResults' }, (err, data) =>
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

// TODO: Scan is not the way to do this, we should use secondary keys
router.get('/:id', cors(corsOptions), function(req, res, next) {
  //ddb.query({ TableName: 'TestResults', ProjectionExpression: "feature_id, id, passed", KeyConditionExpression: `feature_id = :id`, ExpressionAttributeValues: { ":id": { S: `${req.params.id}` } }}, (err, data) =>
  ddb.scan({TableName: 'TestResults', FilterExpression: "#id = :id", ExpressionAttributeNames: { "#id": "feature_id" }, ExpressionAttributeValues: { ":id": { S: `${req.params.id}` } }}, (err, data) => {
    if (err) {
      console.dir(err);
      res.send({ "msg": "Error", "data": data });
      return;
    }
    if (!data || !data.Items) {
      res.send({ "msg": "Error: No item found", "data": data});
      return;
    }
    const results = data.Items.map((item) =>
    {
      return {
        id: item.id.S,
        feature_id: item.feature_id.S,
        version: item.version ? item.version.S : "0.0.0",
        passed: item.passed.BOOL
      }
    });
    res.send({ "msg": "Success", "data": results })
  });
});

router.post('/', cors(corsOptions), async function(req, res, next) {
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
          dbKey: "version",
          shorthand: ":v",
          dynamoType: "S"
      }
  ]
  const result = req.body;
  var uniqueResultID = Date.now();
  var params = {
    TableName: 'TestResults',
    Item: { "id": {"S": `${uniqueResultID}`}, ...packAWSData(result, testExpressionKeys) }
  };
  ddb.putItem(params, () => res.send({ msg: "Success", data: { 'id': uniqueResultID } }))
})

module.exports = router;