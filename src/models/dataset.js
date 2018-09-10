import { message } from 'antd';
import { queryDataset, makePublicDataset, makePrivateDataset, updateDataset, removeDataset } from '../services/datasetAPI';
import { createDataset } from '../../mock/dataset';

export default {
  namespace: 'dataset',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveDatasetList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },
  },
  effects: {

    *fetchDatasetList({ payload }, { call, put }) {
      const response = yield call(queryDataset, payload);
      yield put({
        type: 'saveDatasetList',
        payload: response,
      });
    },

    *removeDataset({ payload, callback }, { call, put }) {
      const response = yield call(removeDataset, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *makePublicDataset({ payload, callback }, { call, put }) {
      const response = yield call(makePublicDataset, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *makePrivateDataset({ payload, callback }, { call, put }) {
      const response = yield call(makePrivateDataset, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },
    *updateDataset({ payload, callback }, { call, put }) {
      const response = yield call(updateDataset, { ...payload });
      if (response.success) {
        message.success(response.message);
        callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *createDataset({ payload, resolve, reject }, { call, put }) {
      const response = yield call(createDataset, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
          payload: payload.refreshParams,
        });
        if (resolve !== undefined) {
          resolve(response);
        }
      } else {
        // show message.
        message.error(response.message);
        if (reject !== undefined) {
          reject(response);
        }
      }
    },
  },
};
