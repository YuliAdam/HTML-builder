const _dirname = '03-files-in-folder\\secret-folder';
const fs = require('fs');
const path = require('node:path');

fs.readdir(_dirname, (err, files) => {
  if (err) {
    throw console.log(err);
  } else {
    files.forEach((file) => {
      fs.stat(_dirname + '\\' + file, (err, stats) => {
        if (err) console.log(err);
        else {
          if (stats.isFile()) {
            let currentFilePath = path.extname(file);
            console.log(
              path.basename(file, currentFilePath) +
                ' - ' +
                currentFilePath.substring(1, currentFilePath.length) +
                ' - ' +
                stats.size / 1000 +
                'kb',
            );
          }
        }
      });
    });
  }
});
