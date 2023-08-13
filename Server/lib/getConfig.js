const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config');

function read_ConfigInfo(stage){
    const configFile = `${configPath}/${stage}.json`
    if(fs.existsSync(configFile)){
        const json = fs.readFileSync(configFile, 'utf8');
        const configInfo = JSON.parse(json);
        return configInfo;
    }
}

function getConfigInternal(stage, key){
    const config = read_ConfigInfo(stage);
    return config[key];
}


function set_env(key, value){
    process.env[key] = value;
}

function initConfig(){
    set_env("AWS_ACCOUNT", getConfigInternal("default", "aws_account"));
    set_env("AWS_REGION", getConfigInternal("default", "aws_region"));
    set_env("AWS_S3_BUCKET", getConfigInternal("default", "aws_s3_bucket"));
    set_env("AWS_ACCESS_KEY_ID", getConfigInternal("dev", "aws_access_key_id"));
    set_env("AWS_SECRET_ACCESS_KEY", getConfigInternal("dev", "aws_secret_access_key"));
}


function getConfig(key) {
    const value = process.env[key];
    if(value === undefined || value === null){
        throw new Error(`Config key ${key} not found`);
    }
    return value;
}

initConfig();

module.exports.config = {
    get:getConfig
}