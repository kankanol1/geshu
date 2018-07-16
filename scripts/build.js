#! /usr/bin/env node

/* eslint-disable */

const shell = require('shelljs');

const buildOpt = process.argv.length == 2 ? "*" : process.argv[2];

const tmpDir = 'dist-tmp';

if (shell.test('-d', tmpDir)) {
  shell.rm('-r', tmpDir);
}
shell.mkdir(tmpDir);

if (buildOpt === '*' || buildOpt === 'all') {
  // build all.
  shell.exec('npm run setup');
  const buildProcess = shell.exec('cross-env ESLINT=none roadhog build');
  // copy dist to tmp.
  shell.cp('-R', 'dist', 'dist-tmp/all');
}

if (buildOpt === '*' || buildOpt === 'ml') {
  // build all.
  shell.exec('npm run setup:ml');
  const buildProcess = shell.exec('cross-env ESLINT=none roadhog build');
  // copy dist to tmp.
  shell.cp('-R', 'dist', 'dist-tmp/ml');
}

if (buildOpt === '*' || buildOpt === 'graph') {
  // build all.
  shell.exec('npm run setup:graph');
  const buildProcess = shell.exec('cross-env ESLINT=none roadhog build');
  // copy dist to tmp.
  shell.cp('-R', 'dist', 'dist-tmp/graph');
}

// write to dist;
shell.rm('-r', 'dist');
shell.mv('dist-tmp', "dist");