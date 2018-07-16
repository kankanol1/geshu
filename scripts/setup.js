#! /usr/bin/env node

/* eslint-disable */

const fs = require('fs');

if (process.argv.length > 2) {
  // get the 3rd argument as source file.
  const file = process.argv[2];
  fs.createReadStream(file).pipe(fs.createWriteStream('.webpackrc'));
  console.log('environment setup done.');
} else {
  console.error('setup requires a file path for .webpackrc!');
}
