// ЗАДАЧА - сделать readFile, возвращающее promise
const fs = require('fs');
const util = require('util');

// fs.readFile(filePath, (err, content) => {});

const readFile = util.promisify(fs.readFile);
const readFolder = (folder) => {
  const promises = [];
  fs.readdir(folder, (err, files) => {
    if (err) {
      Promise.reject(error);
      return;
    }
    files.forEach((file) => {
      promises.push(readFile(file));
    });
  });
  return Promise.all(promises);
};

exports.module = readFolder;

