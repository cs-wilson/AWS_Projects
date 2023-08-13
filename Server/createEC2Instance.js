const AWS = require('aws-sdk');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

const createEC2 = async (instanceName, instanceType, imageID) => {

    // 创建EC2服务对象
    const ec2 = new AWS.EC2();

    // 定义创建实例的参数
    const params = {
    ImageId: imageID,  // 替换为你想要的AMI ID
    InstanceType: instanceType, // 替换为你想要的实例类型
    MinCount: 1,
    MaxCount: 1
    };

    // 使用EC2服务对象创建实例
    ec2.runInstances(params, function(err, data) {
    if (err) {
        console.log("创建实例时遇到错误", err);
    } else {
        console.log("成功创建实例", data.Instances[0].InstanceId);
    }
    });
}

createEC2('test2', 't2.micro', 'ami-0c94855ba95c71c99');