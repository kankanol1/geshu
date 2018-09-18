import { message } from 'antd';
import { queryModels, removeModels, updateModel, onlineModel, offlineServingModels } from '../../services/modelsAPI';

export default {
  namespace: 'models',

  state: {
    data: {
      list: [],
      pagination: {},
      labels: [],
    },
  },

  reducers: {
    saveModelList(state, { payload }) {
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
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(queryModels, payload);
      if (response) {
        yield put({
          type: 'saveModelList',
          payload: response,
        });
      }
    },

    *removeModel({ payload, callback }, { call, put }) {
      const response = yield call(removeModels, { ids: payload.ids });
      if (response) {
        if (response.success) {
          message.success(response.message);
          if (callback) {
            callback();
          }
        } else {
          // show message.
          message.error(response.message);
        }
      }
    },

    *updateModel({ payload, callback }, { call, put }) {
      const response = yield call(updateModel, { ...payload });
      if (response) {
        if (response.success) {
          message.success(response.message);
          if (callback) {
            callback();
          }
        } else {
          // show message.
          message.error(response.message);
        }
      }
    },

    *onlineModels({ payload, callback }, { call, put }) {
      const response = yield call(onlineModel, { ...payload });
      if (response) {
        if (response.success) {
          message.success(response.message);
          if (callback) {
            callback();
          }
        } else {
        // show message.
          message.error(response.message);
        }
      }
    },

    *offlineModels({ payload, callback }, { call, put }) {
      const response = yield call(offlineServingModels, { ...payload });
      if (response) {
        if (response.success) {
          message.success(response.message);
          if (callback) {
            callback();
          }
        } else {
          // show message.
          message.error(response.message);
        }
      }
    },
  },
};
