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
        server.send('/datapro/pipeline/status/0', {}, JSON.stringify(result));
      }, 10000);
    },

    // preview a preparedOp
    // after received preview, 2 kinds of data could be sent to client:
    // 1. send part of the data table. type:data, format: {paganation, table}
    // 2. send table status. type: status, format: {calculating: true/false, message}
    '/app/datapro/pipeline/preview': (request, server) => {
      const { body: bs } = request.frame;
      const body = JSON.parse(bs);
      const { projectId, id, size, page } = body;
      const data = [];
      for (let i = 0; i < size; i++) {
        data.push({
          a1: `v1-p-${page}-i-${i}`,
          a2: `v2-p-${page}-i-${i}`,
          a3: `v3-p-${page}-i-${i}`,
          a4: `v4-p-${page}-i-${i}`,
          a5: `v5-p-${page}-i-${i}`,
          a6: `v6-p-${page}-i-${i}`,
          a7: `v7-p-${page}-i-${i}`,
          a8: `v8-p-${page}-i-${i}`,
          a9: `v9-p-${page}-i-${i}`,
          a10: `v10-p-${page}-i-${i}`,
          a11: `v11-p-${page}-i-${i}`,
          a12: `v12-p-${page}-i-${i}`,
        });
      }
      const response = {
        schema: [
          { name: 'a1', type: 'String', nullable: false },
          { name: 'a2', type: 'String', nullable: false },
          { name: 'a3', type: 'String', nullable: false },
          { name: 'a4', type: 'String', nullable: false },
          { name: 'a5', type: 'String', nullable: false },
          { name: 'a6', type: 'String', nullable: false },
          { name: 'a7', type: 'String', nullable: false },
          { name: 'a8', type: 'String', nullable: false },
          { name: 'a9', type: 'String', nullable: false },
          { name: 'a10', type: 'String', nullable: false },
          { name: 'a11', type: 'String', nullable: false },
          { name: 'a12', type: 'String', nullable: false },
        ],
        types: [
          { name: 'a1', type: null },
          { name: 'a2', type: null },
          { name: 'a3', type: 'NAME' },
          { name: 'a4', type: 'EMAIL' },
          { name: 'a5', type: 'ADDRESS' },
          { name: 'a6', type: null },
          { name: 'a7', type: null },
          { name: 'a8', type: null },
          { name: 'a9', type: 'ADDRESS' },
          { name: 'a10', type: 'ADDRESS' },
          { name: 'a11', type: 'NAME' },
          { name: 'a12', type: 'EMAIL' },
        ],
        data,
      };
      const dataTable = {
        type: 'data',
        data: {
          paganation: {
            current: page,
            pageSize: size,
            total: 100,
          },
          table: response,
        },
      };
      // send status first.
      const dataStatus = {
        type: 'status',
        data: {
          status: 'CALCULATING',
          message: '初始化中，请稍后',
        },
      };

      server.send(`/datapro/pipeline/preview/${projectId}/${id}`, {}, JSON.stringify(dataStatus));

      setTimeout(() => {
        dataStatus.data.status = 'CALCULATED';
        server.send(`/datapro/pipeline/preview/${projectId}/${id}`, {}, JSON.stringify(dataStatus));
        server.send(`/datapro/pipeline/preview/${projectId}/${id}`, {}, JSON.stringify(dataTable));
      }, 5000);
    },
  },
};
