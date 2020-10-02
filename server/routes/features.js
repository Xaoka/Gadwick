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

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/* GET users listing. */
router.get('/', cors(corsOptions), function(req, res, next) {
  
  ddb.scan({ TableName: 'Features' }, (err, data) =>
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
});

 router.put(`/:id`, cors(corsOptions), function(req, res, next) {
    const userData = req.body;
    const expressionKeys =
    [
      {
        dbKey: "use_frequency",
        shorthand: ":u",
        dynamoType: "N"
      },
      {
        dbKey: "severity",
        shorthand: ":s",
        dynamoType: "N"
      },
      {
        dbKey: "distinctness",
        shorthand: ":d",
        dynamoType: "N"
      },
      {
        dbKey: "priority",
        shorthand: ":p",
        dynamoType: "N"
      },
      {
        dbKey: "cost",
        shorthand: ":c",
        dynamoType: "N"
      },
      {
        dbKey: "ease",
        shorthand: ":ease",
        dynamoType: "N"
      },
      {
        dbKey: "similar_frequency",
        shorthand: ":f",
        dynamoType: "N"
      },
      {
        dbKey: "problem_frequency",
        shorthand: ":q",
        dynamoType: "N"
      }
    ]
    // console.dir(expressionKeys)
    let expression = ``;
    const attributeValues = { }
    for (const keyConfig of expressionKeys)
    {
      // console.log(`Adding ${keyConfig.dbKey}`)
      if (userData[keyConfig.dbKey])
      {
        if (expression.length === 0)
        {
          expression = `${keyConfig.dbKey} = ${keyConfig.shorthand}`;
        }
        else
        {
          expression = `${expression}, ${keyConfig.dbKey} = ${keyConfig.shorthand}`;
        }
        // console.log(expression)

        attributeValues[keyConfig.shorthand] = { };
        // console.log(`Setting dynamoTyped map to ${userData[keyConfig.dbKey]}`)
        attributeValues[keyConfig.shorthand][keyConfig.dynamoType] = `${userData[keyConfig.dbKey]}`;
        // console.dir(attributeValues)
      }
    }
    // console.dir(attributeValues)
    // console.log(expression)
    // console.dir(req.params)
    // console.log(`ID: ${req.params.id}`)
    expression = `set ${expression}`;
    console.log(`Updating ${req.params.id}`)
    console.log(`With command ${expression}`)
    console.log(`With keys ${JSON.stringify(attributeValues)}`)

    var params = {
      TableName: 'Features',
      Key: { 'feature-id': {"S": `${req.params.id}`} },
      UpdateExpression: expression,
      ExpressionAttributeValues: attributeValues
    };

    // Call DynamoDB to add the item to the table
    ddb.updateItem(params, () => res.send({ "msg": "Success" }));
 })

module.exports = router;
