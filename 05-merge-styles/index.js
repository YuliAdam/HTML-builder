const fs = require('fs');
const path = require('node:path');
const folderName = 'styles';
const newFolderName = 'project-dist';
const fileName = 'bundle.css';
let dataArr = [];
const writeStreem = fs.createWriteStream(
  path.join(__dirname, newFolderName, fileName),
);

fs.readdir(path.join(__dirname, folderName), (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      fs.readFile(path.join(__dirname, folderName, file), (err, data) => {
        if (err) console.log(err);
        dataArr = data.toString().split('\r\n');
        writeStreem.write(dataArr.join('\r\n'));
      });
    }
  });
});
