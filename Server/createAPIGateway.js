var AWS = require('aws-sdk');
const { config } = require('./lib/getConfig');


AWS.config.update(
    {
        region: config.get("AWS_REGION"),
        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),

    });

// 创建 API
const createApi = async (restApiName, description) => {
    const apigateway = new AWS.APIGateway();
    var params = {
        name: restApiName,
        description: description
    };

    const api = await apigateway.createRestApi(params).promise();
    console.log("api: ", api);
    return api;
}

//获取API Gateway的根资源
const getRootResource = async (apiID) => {
    const apigateway = new AWS.APIGateway();
    var params = {
        restApiId: apiID
    };

    const rootResource = await apigateway.getResources(params).promise();
    console.log("rootResource: ", rootResource);
    return rootResource;
}

// 创建API Gateway的资源
const createResource = async (apiID, parentResourceId, pathPart) => {
    const apigateway = new AWS.APIGateway();
    var params = {
        parentId: parentResourceId,
        pathPart: pathPart,
        restApiId: apiID
    };

    const resource = await apigateway.createResource(params).promise();
    console.log("resource: ", resource);
    return resource;
}

// 创建API Gateway的方法
const createMethod = async (apiID, resourceId, httpMethod) => {
    const apigateway = new AWS.APIGateway();
    var params = {
        restApiId: apiID,
        resourceId: resourceId,
        httpMethod: httpMethod,
        authorizationType: 'NONE',
        requestParameters: {}
    }

    const method = await apigateway.putMethod(params).promise();
    console.log("method: ", method);
    return method;
}

// 添加API Gateway的permission
const addPermissionToMethod = async (restApiId, lambdaFunctionName, region, accoundId, httpMethod, resourcePath) => {
    const lambda = new AWS.Lambda({ region: region });
    try {
        const addPermissionParams = {
            FunctionName: lambdaFunctionName,
            StatementId: 'api-gateway-invokes-lambda',
            Action: 'lambda:InvokeFunction',
            Principal: 'apigateway.amazonaws.com',
            SourceArn: `arn:aws:execute-api:${region}:${accoundId}:${restApiId}/*/${httpMethod}/${resourcePath}`
        };

        const addPermissionResult = await lambda.addPermission(addPermissionParams).promise();
        console.log('Permission added successfully:', addPermissionResult);
    } catch (error) {
        console.error('Failed to add permission to Lambda function:', error);
    }
}



// 创建Lambda函数的API Gateway集成
const createIntegration = async (apiID, resourceId, lambdaFunctionName, region) => {
    const apiGateway = new AWS.APIGateway();
    // 获取Lambda函数的ARN
    const lambda = new AWS.Lambda({ region: region });
    const lambdaFunction = await lambda.getFunction({ FunctionName: lambdaFunctionName }).promise();
    const lambdaArn = lambdaFunction.Configuration.FunctionArn;
    console.log("lambdaArn: ", lambdaArn)

    // 创建API Gateway集成
    const integrationParams = {
        restApiId: apiID,
        resourceId: resourceId,
        httpMethod: 'POST',
        type: 'AWS_PROXY',
        integrationHttpMethod: 'POST',
        contentHandling: 'CONVERT_TO_TEXT',
        uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`
    };

    const integration = await apiGateway.putIntegration(integrationParams).promise();
    console.log("integration: ", integration);
    return integration;
};

// 创建Lambda函数的API Gateway集成响应
const createIntegrationResponse = async (apiID, resourceId) => {
    const apiGateway = new AWS.APIGateway();
    const integrationResponseParams = {
        restApiId: apiID,
        resourceId: resourceId,
        httpMethod: 'POST',
        statusCode: '200',
        responseTemplates: {
            'application/json': ''
        }
    };

    const integrationResponse = await apiGateway.putIntegrationResponse(integrationResponseParams).promise();
    console.log("integrationResponse: ", integrationResponse);
    return integrationResponse;
}

// 创建API Gateway的部署
const createDeployment = async (apiID, stageName) => {
    const apigateway = new AWS.APIGateway();
    var params = {
        restApiId: apiID,
        stageName: stageName
    };

    const deployment = await apigateway.createDeployment(params).promise();
    console.log("deployment: ", deployment);
    return deployment;
}

// 创建API Gateway并集成Lambda函数
const createApiAndIntegrateWithLambda = async (apiName, apiDescription, httpMethod, lambdaFunctionName, stageName, region) => {
    const api = await createApi(apiName, apiDescription);
    const apiID = api.id;
    const rootResource = await getRootResource(apiID);
    const rootResourceId = rootResource.items[0].id;
    const resource = await createResource(apiID, rootResourceId, apiName);
    const resourceId = resource.id;
    const method = await createMethod(apiID, resourceId, httpMethod);
    const integration = await createIntegration(apiID, resourceId, lambdaFunctionName, region);
    const permission = await addPermissionToMethod(apiID, lambdaFunctionName, region, config.get("AWS_ACCOUNT"), httpMethod, apiName);
    const integrationResponse = await createIntegrationResponse(apiID, resourceId);
    const deployment = await createDeployment(apiID, stageName);
}

const apiName = "dynamoDB_operation_api";
const apiDescription = "dynamoDB_operation_api";
const httpMethod = "POST";
const stageName = "default";
const lambdaFunctionName = "dynamoDB_operation_lambda";
const region = "us-east-1";
createApiAndIntegrateWithLambda(apiName, apiDescription, httpMethod, lambdaFunctionName, stageName, region);
