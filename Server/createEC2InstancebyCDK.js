const { App, Stack, Tags, CfnOutput } = require('aws-cdk-lib');
const { AmazonLinuxGeneration, AmazonLinuxImage, BlockDeviceVolume, Instance, InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } = require('aws-cdk-lib/aws-ec2');
const ec2 = require('aws-cdk-lib/aws-ec2');
const { config } = require('./lib/getConfig');

const app = new App();
const stack = new Stack(app, 'MyStack', {
  env: {
    account: config.get("AWS_ACCOUNT"),
    region: config.get("AWS_REGION"),
  },
});

// 创建 VPC
const vpc = new Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
      cidrMask: 24,
    },
    {
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE,
      cidrMask: 24,
    },
  ]
});
// 创建 EC2 实例
const instance = new Instance(stack, 'MyInstance', {
  vpc,
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  blockDevices: [
    {
      deviceName: '/dev/xvda',
      volume: BlockDeviceVolume.ebs(8),
    },
  ],
  keyName: 'your_key_pair_name',
});

// 在实例中添加node环境
instance.addUserData(
  'yum install -y curl',
  'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash',
  'source ~/.nvm/nvm.sh',
  'nvm install node'
);

// 运行实例
instance.addUserData('yum update -y');

// 添加标签
Tags.of(instance).add('Name', 'MyInstance');

// 输出实例公有 IP 地址
new CfnOutput(stack, 'InstancePublicIP', {
  value: instance.instancePublicIp,
});

// 输出实例私有 IP 地址
new CfnOutput(stack, 'InstancePrivateIP', {
  value: instance.instancePrivateIp,
});


app.synth();