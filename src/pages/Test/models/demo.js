import { message } from 'antd';

export default {
  namespace: 'demo',
  state: {
    table: {
      data: [],
      columns: [],
    },
    tableName: undefined,
  },
  reducers: {
    updatedata(state, { payload }) {
      const { name: tableName, headers, items } = payload;
      const columns = headers.map(i => {
        return { Header: i, accessor: i };
      });
      const data = items.map(i => {
        const d = {};
        headers.forEach((h, ind) => {
          d[h] = i[ind];
        });
        return d;
      });
      return { ...state, table: { data, columns }, tableName };
    },
  },
  effects: {
    *init(payload, { put }) {
      yield put({
        type: 'ws/send',
        payload: {
          topic: '/app/datapro/init',
          header: {},
          body: '1',
        },
      });
    },

    *onWSReceived({ payload }, { put }) {
      const { body: bs } = payload;
      const body = JSON.parse(bs);
      if (body.type === 'table') {
        yield put({
          type: 'updatedata',
          payload: body.data,
        });
      } else if (body.type === 'done') {
        message.info(`Message:${body.message}`);
      }
    },

    *execute({ payload }, { put }) {
      yield put({
        type: 'ws/send',
        payload: {
          topic: '/app/datapro/execute',
          header: {},
          body: payload,
        },
      });
    },

    // *onWSReceived(payload, {put, call}) {
    //     console.log('payload', payload);
    // },
  },

  subscriptions: {
    setup() {},
  },
};
