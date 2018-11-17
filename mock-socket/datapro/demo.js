let count = 0;

const genTableData = id => {
  const headers = ['name1', 'name2', 'name3', 'name4', 'col2', 'col3', 'col4', 'col5'];
  const columns = [];
  for (let i = 0; i < 1000; i++) {
    columns.push([
      `${count}-1${i}`,
      `${count}-9000${i}`,
      `${count}-name${i}`,
      `${count}-8011dsdad${i}`,
      `${count}-yo119${i}`,
      `${count}-cdd9xx${i}`,
      `${count}-1231232${i}`,
      count * 10000 + 90 * i,
    ]);
  }
  count += 1;
  return { headers, items: columns };
};

export default {
  subscribe: {
    // url : func
    '/topic/greetings': (sth, server) => {
      if (sth.topic === '/topic/greetings') {
        // send back.
        server.send('/topic/greetings', { 'content-type': 'application/json' }, '{"test":"test2"}');
        console.log('send back done'); // eslint-disable-line
      }
    },
  },
  receive: {
    '/app/datapro/init': (sth, server) => {
      // initialization.
      setTimeout(() => {
        const data = genTableData(1);
        const result = { type: 'table', data, success: true, message: null };
        server.send('/user/datapro/recipes', {}, JSON.stringify(result));
      }, 1000);
      // const body = JSON.parse(frame.body);
      // stompServer.send('/topic/greetings', {'content-type': 'application/json'}, `{"test":"test2, ${body.name}"}`);
    },
    '/app/datapro/execute': (sth, server) => {
      // execute.
      // const body = JSON.parse(frame.body);
      // update result.
      let icount = 0;
      const run = () => {
        if (icount < 10) {
          const data = genTableData(1);
          const result = { type: 'table', data, success: true, message: null };
          server.send('/user/datapro/recipes', {}, JSON.stringify(result));
          setTimeout(() => run(), 1000);
        } else if (icount === 10) {
          const result = { type: 'done', success: true, message: 'Done' };
          server.send('/user/datapro/recipes', {}, JSON.stringify(result));
        }
        icount++;
      };
      setTimeout(() => {
        run();
      }, 1000);
    },
  },
};
