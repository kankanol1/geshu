#! /usr/bin/env node

/* eslint-disable */

const shell = require('shelljs');

const partOpt = process.argv.filter((_, i) => i > 0 && process.argv[i - 1] === '-part');
const buildOpt = partOpt.length === 0 ? '-' : partOpt[0];

// @TODO support isRelease latter.
// const isRelease = !process.argv.includes('-dev');
const isRelease = true;
console.log('buildOpt', buildOpt);

const tmpDir = 'dist-tmp';

if (shell.test('-d', tmpDir)) {
  shell.rm('-r', tmpDir);
}
shell.mkdir(tmpDir);

if (buildOpt === '-' || buildOpt === 'all') {
  // build all.
  shell.exec('npm run setup');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/all');
  shell.cp('-R', 'dist/*', 'dist-tmp/all/');
}

if (buildOpt === '-' || buildOpt === 'ml') {
  // build ml part.
  shell.exec('npm run setup:ml');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/ml');
  shell.cp('-R', 'dist/*', 'dist-tmp/ml/');
}

if (buildOpt === '-' || buildOpt === 'graph') {
  // build graph part.
  shell.exec('npm run setup:graph');
  shell.exec(`npm run ${isRelease ? 'build' : 'dev-build'}`);
  // copy dist to tmp.
  shell.mkdir('dist-tmp/graph');
  shell.cp('-R', 'dist/*', 'dist-tmp/graph/');
}

// write to dist;
shell.rm('-r', 'dist');
shell.mv('dist-tmp', 'dist');
