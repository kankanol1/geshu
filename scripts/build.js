#! /usr/bin/env node

/* eslint-disable */

const shell = require('shelljs');

const buildOpt = process.argv.length === 2 ? '*' : process.argv[2];

const devOptInput = process.argv.length === 3 ? 'release': process.argv[3];
const isRelease = devOptInput === 'dev' ? false : true;

const tmpDir = 'dist-tmp';

if (shell.test('-d', tmpDir)) {
  shell.rm('-r', tmpDir);
}
shell.mkdir(tmpDir);

if (buildOpt === '*' || buildOpt === 'all') {
  // build all.
  shell.exec('npm run setup');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/all');
  shell.cp('-R', 'dist/*', 'dist-tmp/all/');
}

if (buildOpt === '*' || buildOpt === 'ml') {
  // build ml part.
  shell.exec('npm run setup:ml');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/ml');
  shell.cp('-R', 'dist/*', 'dist-tmp/ml/');
}

if (buildOpt === '*' || buildOpt === 'graph') {
  // build graph part.
  shell.exec('npm run setup:graph');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/graph');
  shell.cp('-R', 'dist/*', 'dist-tmp/graph/');
}

// write to dist;
shell.rm('-r', 'dist');
shell.mv('dist-tmp', "dist");