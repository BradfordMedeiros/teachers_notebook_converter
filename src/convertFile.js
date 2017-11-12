
const path = require('path');
const child_process = require('child_process');

const out = path.resolve('/Users/brad/Desktop/aaaa/out.notebook');
const inn = path.resolve('/Users/brad/Desktop/aaaa/time.flp');

const convertFilePath = path.resolve('./bin/PrometheanFileConverter.exe');

const convertFile = (fileSource, destination) => new Promise((resolve, reject) => {
  const command = `${convertFilePath} ${path.resolve(fileSource)} ${path.resolve(destination)}`;
  console.log('command is: ', command);
  child_process.exec(command, (err, out) => {
   resolve(); // this binary is really shitty, and will print to stderr, might be bette rway to handle
  });
});


module.exports = convertFile;


