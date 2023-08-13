const AWS = require("aws-sdk");
const fs = require("fs");
const { config } = require("./lib/getConfig");

AWS.config.update({
  region: config.get("AWS_REGION"),
  accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
  secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
});

const deployLambda = async () => {
  const lambda = new AWS.Lambda();

  try {
    // 读取Lambda函数代码
    const lambdaCode = fs.readFileSync("lambdaFunction.zip");

    // 创建Lambda函数的参数
    const params = {
      Code: { ZipFile: lambdaCode },
      FunctionName: "dynamoDB_operation_lambda",
      Handler: "index.handler",
      Role: "arn:aws:iam::933685007364:role/lambda_execue_role", // Lambda函数的执行角色
      Runtime: "nodejs18.x",
    };

    // 创建Lambda函数
    const createResponse = await lambda.createFunction(params).promise();
    console.log("Lambda函数创建成功：", createResponse);

    // 部署完成
    console.log("Lambda函数部署完成");
  } catch (err) {
    console.error("Lambda函数部署失败：", err);
  }
};

deployLambda();
