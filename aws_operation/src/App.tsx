import React from "react";
import "./App.css";
import uploadFileToS3  from "./uploadS3";

function App() {
  const [inputText, setInputText] = React.useState("");
  const [fileContent, setFileContent] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const handleTextInputChange = (event: any) => {
    setInputText(event.target.value);

  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    console.log("file:", file)
    setFileName(fileName);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      console.log("content:", content)
      setFileContent(content as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    // 在这里执行提交逻辑
    console.log("文本输入:", inputText);
    console.log("文件内容:", fileContent);
    uploadFileToS3(fileName,fileContent);
    
  };

  return (
    <div className="App">
      <h1>AWS File Operation</h1>
      <div className="inputContainer">
        <label className="label">
          Text input: 
        <input type="text" value={inputText} onChange={handleTextInputChange} />
        </label>
        <br/>
        <br/>
        <label className="label">
          File input: 
        <input type="file" onChange={handleFileInputChange} />
        </label>
        <br/>
        <br/>
        <button onClick={handleSubmit}>submit</button>
      </div>
    </div>
  );
}

export default App;
