const fs = require('fs').promises;
const path = require('path');
const _dirnameOriginal = path.join(__dirname, 'files');
const _dirnameNew = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.rm(_dirnameNew, { recursive: true, force: true });
    await fs.mkdir(_dirnameNew, { recursive: true });

    const files = await fs.readdir(_dirnameOriginal, (err, files) => {
      if (err) console.log(err);
      return files;
    });

    files.forEach((file) => {
      fs.copyFile(
        path.join(_dirnameOriginal, file),
        path.join(_dirnameNew, file),
      );
    });
  } catch (err) {
    if (err) console.log(err);
  }
}

copyDir();
