import React from "react";
import "./App.css";
import s3Utils from "./lib/s3Utils";
import AWS from "aws-sdk";

function App() {
  const [inputText, setInputText] = React.useState("");
  const [fileContent, setFileContent] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const handleTextInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    console.log("file:", file);
    setFileName(fileName);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      console.log("content:", content);
      setFileContent(content as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    // 在这里执行提交逻辑
    console.log("文本输入:", inputText);
    console.log("文件内容:", fileContent);
    console.log("文件名:", fileName);
    // HTTP请求发往后端获取临时凭证
    const credentials = await requestCredentials();
    // 使用临时凭证上传文件
    const success = await uploadFile(credentials, fileName, fileContent);
    console.log("success:", success);
  };

  return (
    <div className="App">
      <h1>AWS File Operation</h1>
      <div className="inputContainer">
        <label className="label">
          Text input:
          <input
            type="text"
            value={inputText}
            onChange={handleTextInputChange}
          />
        </label>
        <br />
        <br />
        <label className="label">
          File input:
          <input type="file" onChange={handleFileInputChange} />
        </label>
        <br />
        <br />
        <button onClick={handleSubmit}>submit</button>
      </div>
    </div>
  );
}

export default App;

async function requestCredentials() {
  const url = "http://localhost:5001/requestCredentials";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function uploadFile(credentials: any, fileName: string, fileContent: string) {
  AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.Credentials(
      credentials.AccessKeyId,
      credentials.SecretAccessKey,
      credentials.SessionToken
    ),
  });
  const bucketName = "aws-file-project-bucket";
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: `${bucketName}/${fileName}`,
    Body: fileContent,
  };

  const success = await s3.upload(params).promise();
  console.log("success:", success);
  return success;
}
