var http = require('http');
var sts = require('./sts');

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

// http模块实例化
var server = http.createServer(async function (req, res) {
   // 验证请求
   if (req.url === '/requestCredentials') {
      try {
         const response = await sts.getCredentialsToken(s3_IAM, "s3Role");
         console.log("response", response);
         res.writeHead(200, 
            { 
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin': '*',
             });
         res.write(JSON.stringify(response));
         res.end();
      } catch (error) {
         res.writeHead(500, { 'Content-Type': 'text/plain' });
         res.end('Internal Server Error');
         console.error(error);
      }
   } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
   }
});

// 启动服务器
server.listen(5001, function () {
   // 传入了两个参数
   // 第一个参数是5001是端口号，第二个参数是一个函数，表示服务器启动后执行的事
   // 在终端控制台上打印，方便了解服务器是否启动成功    
   console.log("服务器启动成功，浏览器地址：http://127.0.0.1:5001/")
})
