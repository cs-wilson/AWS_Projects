const aws = require('aws-sdk');
const config = require('./lib/getConfig').config;

aws.config.update({
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
    region: config.get('AWS_REGION')
});

const sts = new aws.STS();

let s3_IAM = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowBucketAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:HeadBucket",
                "s3:HeadObject",
            ],
            "Resource": [
                "arn:aws:s3:::aws-file-project-bucket",
                "arn:aws:s3:::aws-file-project-bucket/*",
                "arn:aws:s3:::aws-operation-bucket-2023",
                "arn:aws:s3:::aws-operation-bucket-2023/*"
            ]
        }
    ]
}

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
              "dynamodb:DescribeTable"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:933685007364:table/fileStore"
          }
        ]
      }

function getCredentialsToken(serviceIAM, serviceIAMRole) {
    return new Promise((resolve, reject) => {
        var params = {
            Policy: JSON.stringify(serviceIAM), //假定角色策略的JSON文档。
            Name: serviceIAMRole  //角色名称。
        };
        sts.getFederationToken(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                return reject(err);
            }
            else {
                // console.log(data);
                return resolve(data.Credentials);
            }
        });
    })
}

module.exports = {
    getCredentialsToken: getCredentialsToken
}