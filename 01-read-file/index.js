const fs = require('fs');
const _dirname = '01-read-file\\text.txt';
const readableStreem = fs.ReadStream(_dirname);
readableStreem.on('data', function (chunk) {
  console.log(chunk.toString());
});
