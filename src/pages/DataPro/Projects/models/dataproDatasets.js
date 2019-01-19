import { message } from 'antd';
import { queryAllDatasets, deleteDataset } from '@/services/datapro/datasetAPI';

export default {
  namespace: 'dataproDatasets',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveQueryResult(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },

  effects: {
    *fetchAllDatasets({ payload }, { call, put }) {
      const response = yield call(queryAllDatasets, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },

    *deleteDataset({ payload, callback }, { call, put }) {
      const response = yield call(deleteDataset, payload);
      if (response) {
        if (response.success) {
          message.info('删除成功');
        } else {
          message.error(response.message);
        }
        callback();
      }
    },
  },
};
