import { message } from 'antd';
import { stringify } from 'qs';
import request from '../../../utils/request';

export async function sendInit() {
  return request(`/api/datapro/demo/init`);
}

export async function sendQuery(params) {
  return request(`/api/datapro/demo/data?${stringify(params)}`);
}

export default {
  namespace: 'demo1',
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
    *init({ payload }, { put, call }) {
      const response = yield call(sendInit);
      if (response) {
        if (response.success) {
          message.success(response.message);
        } else {
          message.error(response.message);
        }
      }
    },

    *fetchData({ payload }, { put, call }) {
      const response = yield call(sendQuery, payload);
      if (response) {
        if (response.success) {
          message.success(response.message);
          yield put({
            type: 'updatedata',
            payload: response.data,
          });
        } else {
          message.error(response.message);
        }
      }
    },
  },
};
