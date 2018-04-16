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
      yield put({
        type: 'saveModelList',
        payload: response,
      });
    },

    *removeModel({ payload }, { call, put }) {
      const response = yield call(removeModels, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchModelList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *updateModel({ payload }, { call, put }) {
      const response = yield call(updateModel, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchModelList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *onlineModels({ payload }, { call, put }) {
      const response = yield call(onlineModel, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchCandidateModelList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *offlineModels({ payload }, { call, put }) {
      const response = yield call(offlineServingModels, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchCandidateModelList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },
  },
};