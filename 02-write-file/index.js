const HELLOMESSAGE =
  'Hello! Write something in the console. It is will be saved in the my-text.txt file.';
const GOODBYEMESSAGE = 'Thanks for testing. Goodbye!';
const EXITWORD = 'exit';
const FILENAME = 'my-text.txt';
const _dirname = '02-write-file\\';

let fs = require('fs');

const writeStream = fs.createWriteStream(_dirname + FILENAME);
console.log(HELLOMESSAGE);

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const line = readline.createInterface({ input, output });

line.on('line', (input) => {
  writeStream.write(`${input}`);
  if (input.toLowerCase() === EXITWORD) {
    writeEnd();
  }
});

line.on('SIGINT', () => writeEnd());

function writeEnd() {
  writeStream.end();
  line.close();
  console.log(GOODBYEMESSAGE);
}
