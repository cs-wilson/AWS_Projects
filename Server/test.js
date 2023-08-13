const AWS = require('aws-sdk');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

const main = async () => {
    console.log("Hello World!")
}

main();

