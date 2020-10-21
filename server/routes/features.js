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

const expressionKeys =
[
  {
    dbKey: "feature_name",
    shorthand: ":n",
    dynamoType: "S"
  },
  {
    dbKey: "description",
    shorthand: ":desc",
    dynamoType: "S"
  },
  {
    dbKey: "passRate",
    shorthand: ":pass",
    dynamoType: "N"
  },
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

function createAWSExpression(userData, keysConfig)
{
  if (!userData)
  {
    console.log(`No userdata found`)
  }
  if (!keysConfig)
  {
    console.log(`no keys config found`)
  }
  let expression = ``;
  const attributeValues = { };
  for (const keyConfig of keysConfig)
    {
      // console.log(`Adding ${keyConfig.dbKey}`)
      if (userData[keyConfig.dbKey] !== null && userData[keyConfig.dbKey] !== undefined)
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
    console.dir(attributeValues)
    console.log(expression)
    return { expression, attributeValues };
}

 router.put(`/:id`, cors(corsOptions), function(req, res, next) {
    const userData = req.body;
    let { expression, attributeValues } = createAWSExpression(userData, expressionKeys);
    // console.dir(expressionKeys)
    
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

 router.delete(`/:id`, cors(corsOptions), function(req, res, next) {
  var params = {
    TableName: 'Features',
    Key: { 'feature-id': {"S": `${req.params.id}`} },
  }
   ddb.deleteItem(params, () => res.send({ "msg": "Success" }));
 })

 router.post(`/`, cors(corsOptions), function(req, res, next) {
  const userData = req.body;
   var uniqueID = Date.now();
   console.log(`Packing for UID: ${uniqueID}, data: ${JSON.stringify(userData)}`)
  //  const { expression, attributeValues } = packAWSData(userData, expressionKeys);
   var params = {
    TableName: 'Features',
    Item: { "feature-id": {"S": `${uniqueID}`}, ...packAWSData(userData, expressionKeys) }
    // Key: { 'feature-id': {"S": `${uniqueID}`} },
    // UpdateExpression: expression,
    // ExpressionAttributeValues: attributeValues
  };
   ddb.putItem(params, (err, data) => res.send({ msg: "Success", data: { 'feature-id': uniqueID }, error: err }))
 });

module.exports = router;
