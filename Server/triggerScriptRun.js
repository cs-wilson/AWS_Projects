const AWS = require('aws-sdk');

exports.handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const instanceId = 'i-0b9b2b2b2b2b2b2b2';

            await runScriptOnEC2(instanceId);
        }
    }
};

const runScriptOnEC2 = async (instanceId) => {
    const command = "";
    const runCommandParams = {
        DocumentName: 'AWS-RunShellScript',
        InstanceIds: [instanceId],
        Parameters: {
            'commands': ['your_script_to_run']
        }
    };

    try {
        const response = await ec2.sendCommand(runCommandParams).promise();
        console.log("执行脚本命令成功：", response);
    } catch (err) {
        console.error("执行脚本命令失败：", err);
    }
}