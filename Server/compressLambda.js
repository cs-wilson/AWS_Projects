const fs = require('fs');
const archiver = require('archiver');

const compressFile = (inputFolderPath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log('File compression complete!');
      resolve();
    });

    archive.on('error', (err) => {
      console.error('Error compressing file:', err);
      reject(err);
    });

    archive.pipe(output);
    
    archive.directory(inputFolderPath, false);

    archive.finalize();
  });
};

const inputFolderPath = './lambdaFunction';
const outputFilePath = './lambdaFunction.zip';

compressFile(inputFolderPath, outputFilePath)
  .then(() => {
    console.log('File compression successfully completed!');
  })
  .catch((err) => {
    console.error('Error compressing file:', err);
  });