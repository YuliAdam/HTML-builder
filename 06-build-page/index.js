const fs = require('fs');
const promis = require('fs').promises;
const path = require('node:path');
const newFolder = 'project-dist';
const newHtml = 'index.html';
const newCSS = 'style.css';
const assetsFolder = 'assets';
const styleFolder = 'styles';
let dataArr = [];
const templateFile = 'template.html';
const compponentsFolder = 'components';

async function buildPage() {
  await copyAssets();
  buildHTML();
  copyCSS();
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

async function buildHTML() {
  try {
    const initHTMLPath = path.join(__dirname, templateFile);
    const resultHTMLPath = path.join(__dirname, newFolder, newHtml);
    const componentsFolderPath = path.join(__dirname, compponentsFolder);
    await promis.copyFile(initHTMLPath, resultHTMLPath);
    let template = await promis.readFile(resultHTMLPath, 'utf-8');
    let templateData = template.toString();
    const files = await promis.readdir(componentsFolderPath, {
      withFileTypes: true,
    });
    files.forEach(async (file) => {
      if (
        file.isFile() &&
        path.extname(path.join(componentsFolderPath, file.name)) === '.html'
      ) {
        const contentData = await promis.readFile(
          path.join(componentsFolderPath, file.name),
          'utf-8',
        );
        templateData = templateData.replace(
          `{{${path.basename(file.name, '.html')}}}`,
          contentData,
        );
        await promis.writeFile(resultHTMLPath, templateData);
      }
    });
  } catch (e) {
    error(e);
  }
}

buildPage();
