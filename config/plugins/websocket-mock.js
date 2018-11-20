import http from 'http';
import { join } from 'path';
import glob from 'glob';
import assert from 'assert';
import chokidar from 'chokidar';
import signale from 'signale';
import { existsSync } from 'fs';
import StompServer from 'gl-stomp-broker-js';

export default function(api, { port }) {
  const { debug } = api;
  const errors = [];
  if (process.env.MOCK === 'none') {
    // no setup.
    debug('will skip setting up websocket mock due to MOCK=none');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    debug('will skip setting up websocket mock due to production mode');
    return;
  }

  const { paths, cwd } = api.service;
  const absConfigPath = join(cwd, '.umirc.mock.ws.js');

  // get config first.
  const getConfig = () => {
    // Clear errors
    errors.splice(0, errors.length);

    cleanRequireCache();
    let ret = {};
    if (existsSync(absConfigPath)) {
      debug(`load mock data from ${absConfigPath}`);
      ret = require(absConfigPath); // eslint-disable-line
    } else {
      const mockFiles = glob.sync('**/*.js', {
        cwd: absMockPath,
      });
      debug(`load mock data from ${absMockPath}, including files ${JSON.stringify(mockFiles)}`);
      try {
        ret = mockFiles.reduce((memo, mockFile) => {
          const m = require(join(absMockPath, mockFile)); // eslint-disable-line
          const { publish, receive } = m.default || m;
          // eslint-disable-next-line
          memo = {
            publish: { ...memo.publish, ...publish },
            receive: { ...memo.receive, ...receive },
          };
          return memo;
        }, {});
      } catch (e) {
        errors.push(e);
        signale.error(`Mock file parse failed`);
        console.error(e.message); // eslint-disable-line
      }
    }
    return ret;
  };

  // const entryFile = join(paths.cwd, '/mock-socket/index.js');

  const absMockPath = join(cwd, 'mock-socket');
  api.addBabelRegister([absMockPath]);

  const server = http.createServer();
  server.listen(port);

  const startMock = () => {
    const config = getConfig();

    const stompServer = new StompServer({ server, protocol: 'sockjs', path: '' });

    stompServer.on('subscribe', sth => {
      console.log('on subscribe', sth); // eslint-disable-line
      const func = config.receive[sth.topic];
      if (func) func(sth, stompServer);
    });

    stompServer.on('receive', sth => {
      console.log('sth has been received ~~~~~~ ', sth); // eslint-disable-line
      const { dest } = sth;
      const func = config.receive[dest];
      if (func) func(sth, stompServer);
    });
    // eslint-disable-next-line
    console.log('server setup');
  };

  const cleanRequireCache = () => {
    Object.keys(require.cache).forEach(file => {
      if (file.indexOf(absMockPath) > -1) {
        delete require.cache[file];
      }
    });
  };

  api.beforeDevServer(() => {
    startMock();
  });

  if (process.env.WATCH_FILES !== 'none') {
    // watch files.
    const watcher = chokidar.watch([absMockPath], {
      ignoreInitial: true,
    });
    watcher.on('all', (event, file) => {
      debug(`[${event}] ${file}, reload mock data`);
      startMock();
    });
  }

  // api.addPageWatcher([entryFile]);

  api.onDevCompileDone(() => {
    if (errors.length) {
      signale.error(`Mock file parse failed`);
      errors.forEach(e => {
        console.error(e.message); // eslint-disable-line
      });
    }
  });
}
