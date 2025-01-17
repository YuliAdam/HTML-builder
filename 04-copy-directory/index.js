const fs = require('fs');
const path = require('path');
const _dirnameOriginal = path.join(__dirname, 'files');
const _dirnameNew = path.join(__dirname, 'files-copy');

fs.mkdir(_dirnameNew, { recursive: true }, (err) => {
  error(err);
});

fs.readdir(_dirnameOriginal, (err, files) => {
  error(err);
  files.forEach((file) => {
    fs.copyFile(
      _dirnameOriginal + '\\' + file,
      _dirnameNew + '\\' + file,
      (err) => {
        if (err) console.log(err);
      },
    );
  });
});

fs.readdir(_dirnameNew, (err, files) => {
  error(err);
  files.forEach((file) => {
    fs.access(_dirnameOriginal + '\\' + file, (err) => {
      if (err)
        fs.unlink(_dirnameNew + '\\' + file, (err) => {
          error(err);
        });
    });
  });
});

function error(err) {
  if (err) console.log(err);
}
