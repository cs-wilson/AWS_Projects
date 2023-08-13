const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

const saveFileDataToTable = async (tableName, outputFilePath) => {
    const dynamoDB = new AWS.DynamoDB();
    const params = {
        TableName: tableName,
        Item: {
            id: { S: uuidv4() },
            outputFilePath: { S: outputFilePath },
        }
    };

    try {
        await dynamoDB.putItem(params).promise();
        console.log('File data saved to DynamoDB table.');
    } catch (error) {
        console.error('Error saving file data to DynamoDB table:', error);
    }
};

const main = async () => {
    const tableName = 'outFileStoreTable'; // 替换为您的表名
    const outputFilePath = 'aws-operation-bucket-2023/OutputFile.txt';
    await saveFileDataToTable(tableName, outputFilePath);
};

main();

