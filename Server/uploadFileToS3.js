const AWS = require('aws-sdk');
const fs = require('fs');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

const uploadObject = async(bucketName, key, fileName) => {
    const s3 = new AWS.S3();
    const fileContent = fs.readFileSync(fileName);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };
    const objects = await s3.listObjects({ Bucket: bucketName }).promise();
    const objectExists = objects.Contents?.some((object) => object.Key === key);
    if (!objectExists) {
        s3.upload(params, (error, data) => {
            if (error) {
                console.error('Error:', error);
                return false;
            } else {
                console.log('Successfully uploaded to S3:', data.Location);
                return true;
            }
        });
    } else {
        console.log("Object already exists, please change the key");
        return false;
    }
}

const bucketName = 'aws-operation-bucket-2023';
const key = 'aws-operation-bucket-2023/OutputFile.txt';
const fileName = './output/file.txt'
uploadObject(bucketName, key, fileName)