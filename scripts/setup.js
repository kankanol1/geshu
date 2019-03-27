#! /usr/bin/env node

/* eslint-disable */

const { copyFileTo } = require('./utils');

const opts = {
  all: [
    { from: 'all/router.entry.js', to: 'config/router.config.js' },
    { from: 'all/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
  ml: [
    { from: 'ml/router.entry.js', to: 'config/router.config.js' },
    { from: 'ml/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
  graph: [
    { from: 'graph/router.entry.js', to: 'config/router.config.js' },
    { from: 'graph/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
  datapro: [
    { from: 'datapro/router.entry.js', to: 'config/router.config.js' },
    { from: 'datapro/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
  'datapro-client': [
    { from: 'datapro-client/router.entry.js', to: 'config/router.config.js' },
    { from: 'datapro-client/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
  'datapro-all': [
    { from: 'datapro-all/router.entry.js', to: 'config/router.config.js' },
    { from: 'datapro-all/defaultSettings.js', to: 'src/defaultSettings.js' },
  ],
};

try {
  let opt = process.argv.length > 2 ? process.argv[2] : 'all';
  opts[opt].map(item => copyFileTo(`config/app/${item.from}`, item.to));
  console.log('environment setup done.');
} catch (e) {
  console.error('error setting up environment!', e);
}
