
function packAWSData(data, awsKeys)
{
  const awsData = {};
  for (const keyConfig of awsKeys)
  {
    console.log(`Trying to pack: ${keyConfig.dbKey}:: ${data[keyConfig.dbKey]}`)
    if (data[keyConfig.dbKey] !== null && data[keyConfig.dbKey] !== undefined)
    {
      awsData[keyConfig.dbKey] = { };
      if (keyConfig.dynamoType === "BOOL")
      {
        awsData[keyConfig.dbKey][keyConfig.dynamoType] = data[keyConfig.dbKey];
      }
      else
      {
          awsData[keyConfig.dbKey][keyConfig.dynamoType] = `${data[keyConfig.dbKey]}`;
      }
    }
  }
  console.log(`Packed Data: ${JSON.stringify(awsData)}`)
  return awsData;
}

module.exports = packAWSData;