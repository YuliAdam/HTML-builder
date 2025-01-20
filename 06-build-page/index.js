const fs = require('fs');
const promis = require('fs').promises;
const path = require('node:path');
const newFolder = 'project-dist';
const newHtml = 'index.html';
const newCSS = 'style.css';
const assetsFolder = 'assets';
const styleFolder = 'styles';
let dataArr = [];

async function buildPage() {
  await copyAssets();
  copyCSS();
  const writeHTMLStreem = fs.createWriteStream(
    path.join(__dirname, newFolder, newHtml),
  );
}

function error(err) {
  if (err) console.log(err);
}
async function mkDir(dest) {
  try {
    await promis.mkdir(dest, { recursive: true });
  } catch (e) {
    error(e);
  }
}
async function readDir(src, dest) {
  try {
    await mkDir(dest);
    const files = await promis.readdir(
      src,
      { withFileTypes: true },
      (err, files) => {
        error(err);
        return files;
      },
    );
    files.forEach((file) => {
      const pathSrc = path.join(src, file.name);
      const pathDest = path.join(dest, file.name);
      if (file.isDirectory()) {
        readDir(pathSrc, pathDest);
      } else {
        copyDir(pathSrc, pathDest);
      }
    });
  } catch (e) {
    error(e);
  }
}

async function copyDir(src, dest) {
  try {
    await promis.copyFile(src, dest);
  } catch (e) {
    error(e);
  }
}
async function copyAssets() {
  await promis.rm(path.join(__dirname, newFolder), {
    recursive: true,
    force: true,
  });
  await mkDir(path.join(__dirname, newFolder));
  readDir(
    path.join(__dirname, assetsFolder),
    path.join(__dirname, newFolder, assetsFolder),
  );
}

async function copyCSS() {
  const writeCSSStreem = fs.createWriteStream(
    path.join(__dirname, newFolder, newCSS),
  );
  const files = await promis.readdir(
    path.join(__dirname, styleFolder),
    (err, files) => {
      error(err);
      return files;
    },
  );
  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      fs.readFile(path.join(__dirname, styleFolder, file), (err, data) => {
        error(err);
        dataArr = data.toString().split('\r\n');
        writeCSSStreem.write(dataArr.join('\r\n'));
      });
    }
  });
}

buildPage();
