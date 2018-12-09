export default {
  subscribe: {},
  receive: {
    '/datapro/pipeline/status/0': (request, server) => {
      const sps = [
        ['READY', 'CALCULATED', 'RUNNING', 'CALCULATING', 'ERROR', 'EMPTY'],
        ['RUNNING', 'CALCULATING', 'READY', 'EMPTY', 'ERROR', 'EMPTY'],
      ];
      let lastStatus = 0;
      setInterval(() => {
        if (lastStatus === 0) {
          lastStatus = 1;
        } else {
          lastStatus = 0;
        }
        const sp = sps[lastStatus];
        const status = {
          '0136ee04-d9d8-4c90-9b5c-1f2152da564d': {
            status: sp[0],
          },
          name1: {
            status: sp[1],
          },
          '3e8e9b3d-479a-4e29-98f8-b1828dc32ee7': {
            status: sp[2],
          },
          nu8: {
            status: sp[3],
          },
          '618ee91e-1562-4f7d-8f12-14dc51b727dc': {
            status: sp[4],
          },
          gg9: {
            status: sp[5],
          },
        };
        const result = { status };
        server.send('/user/datapro/pipeline/status/0', {}, JSON.stringify(result));
      }, 10000);
    },
  },
};
