const AWS = require('aws-sdk');
const sts = require('./sts');

async function createDynamoDBTable() {
  let dynamoDB_IAM = {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AllowDynamoDBAccess",
        "Effect": "Allow",
        "Action": [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
          "dynamodb:CreateTable"
        ],
        "Resource":[
          "arn:aws:dynamodb:us-east-1:933685007364:table/fileStoreTable",
          "arn:aws:dynamodb:us-east-1:933685007364:table/outFileStoreTable",
        ] 
      }
    ]
  }

  const credentials = await sts.getCredentialsToken(dynamoDB_IAM, "dynamoDBRole");


  AWS.config.update({
    region: credentials.Region,
    accessKeyId: credentials.AccessKeyId,
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken
  });

  const dynamodb = new AWS.DynamoDB();

  const params = {
    TableName: 'fileStoreTable',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5 
    }
  };


  const outFileTableParams = {
    TableName: 'outFileStoreTable',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5 
    }
  };

  // dynamodb.createTable(params, (err, data) => {
  //   if (err) {
  //     console.error('创建 DynamoDB 表时发生错误：', err);
  //   } else {
  //     console.log('DynamoDB 表创建成功：', data);
  //   }
  // });

  dynamodb.createTable(outFileTableParams, (err, data) => {
    if (err) {
      console.error('创建 DynamoDB 表时发生错误：', err);
    } else {
      console.log('DynamoDB 表创建成功：', data);
    }
  });
}


createDynamoDBTable();
