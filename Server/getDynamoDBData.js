const AWS = require('aws-sdk');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });


const dynamoDB = new AWS.DynamoDB();

const getTableData = async (tableName) => {
  const scanParams = {
    TableName: tableName
  };

  try {
    const scanResult = await dynamoDB.scan(scanParams).promise();
    console.log('Table data:', scanResult.Items);
  } catch (error) {
    console.error('Error getting table data:', error);
  }
};

const getDataById = async (tableName, id) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: tableName,
    Key: {
      id: id
    }
  };

  try {
    const content = await docClient.get(params).promise();
    console.log('Content:', content);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

const tableName = 'fileStoreTable'; // 替换为您的表名
const id = 'ec131850-32c9-4fc9-980f-63d09d19b342';

// getTableData(tableName);
getDataById(tableName, id); // 替换为您的id
