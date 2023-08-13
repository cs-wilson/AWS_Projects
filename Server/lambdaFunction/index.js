const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const saveFileData = async (event) => {
  const tableName = "fileStoreTable"; 
  try {

    const input_text = event.body.input_text;
    const input_file_path = event.body.input_file_path;

    const id = uuidv4();
    const params = {
      TableName: tableName,
      Item: {
        id,
        input_text,
        input_file_path
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data saved successfully" })
    };
  } catch (error) {
    console.error('Error saving data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving data" })
    };
  }
};

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case 'POST':
      return await saveFileData(event);
    case 'GET':
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" })
      };
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" })
      };
  }
}
