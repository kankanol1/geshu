import { message } from 'antd';
import { queryDataset, makePublicDataset, makePrivateDataset, updateDataset, removeDataset, getDatasetSchema, createDataset, getDatasetInfoForId } from '../services/datasetAPI';

export default {
  namespace: 'dataset',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    create: {
      // schema return.
      scehma: {},
      result: {},
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

    saveDatasetSchema(state, { payload }) {
      return {
        ...state,
        create: {
          ...state.create,
          schema: payload,
        },
      };
    },

    saveCreateDatasetResult(state, { payload }) {
      return {
        ...state,
        create: {
          ...state.create,
          result: payload,
        },
      };
    },
  },
  effects: {

    *fetchDatasetList({ payload }, { call, put }) {
      const response = yield call(queryDataset, payload);
      if (response) {
        yield put({
          type: 'saveDatasetList',
          payload: response,
        });
      }
    },

    *removeDataset({ payload, callback }, { call, put }) {
      const response = yield call(removeDataset, { ids: payload.ids });
      if (response) {
        if (response.success) {
          message.success(response.message);
          callback();
        } else {
        // show message.
          message.error(response.message);
        }
      }
    },

    *makePublicDataset({ payload, callback }, { call, put }) {
      const response = yield call(makePublicDataset, { ids: payload.ids });
      if (response) {
        if (response.success) {
          message.success(response.message);
          callback();
        } else {
        // show message.
          message.error(response.message);
        }
      }
    },

    *makePrivateDataset({ payload, callback }, { call, put }) {
      const response = yield call(makePrivateDataset, { ids: payload.ids });
      if (response) {
        if (response.success) {
          message.success(response.message);
          callback();
        } else {
        // show message.
          message.error(response.message);
        }
      }
    },

    *updateDataset({ payload, callback }, { call, put }) {
      const response = yield call(updateDataset, payload);
      if (response) {
        yield put({
          type: 'saveCreateDatasetResult',
          payload: response,
        });
        if (callback) callback();
      }
    },

    *getSchema({ payload, callback }, { call, put }) {
      const response = yield call(getDatasetSchema, payload);
      if (response) {
        yield put({
          type: 'saveDatasetSchema',
          payload: response,
        });
        if (callback) callback();
      }
    },

    *createDataset({ payload, callback }, { call, put }) {
      const response = yield call(createDataset, payload);
      if (response) {
        yield put({
          type: 'saveCreateDatasetResult',
          payload: response,
        });
        if (callback) callback();
      }
    },

    *fetchDatasetInfoForId({ payload, callback }, { call, put }) {
      const response = yield call(getDatasetInfoForId, payload);
      if (callback) {
        callback(response);
      }
    },
  },
};
