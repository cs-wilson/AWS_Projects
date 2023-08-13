const AWS = require('aws-sdk');
const fs = require('fs');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

const downloadInputFile = async (bucketName, inputFileKey) => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: inputFileKey
    };

    const response = await s3.getObject(params).promise();;
    console.log(response.Body.toString('utf-8'));
    return response.Body;
    console.log('Input file downloaded successfully!');
}

const appendDataToNewFile = async (outputFile, inputFileContent) => {
    const inputText = 'Test Input Text';
    var new_fileContent = inputFileContent.toString() + " : " + inputText;
    const file = fs.createWriteStream(outputFile);
    file.write(new_fileContent);
    file.close();
    console.log('Output file created successfully!');
}




const bucketName = 'aws-operation-bucket-2023';
const inputFileKey = 'aws-operation-bucket-2023/InputFile.txt';
const outputFile = './output/file.txt';

const main = async() => {
    const inputFileContent = await downloadInputFile(bucketName, inputFileKey);
    console.log("inputFileContent: ", inputFileContent)
    appendDataToNewFile(outputFile, inputFileContent);
}

main();