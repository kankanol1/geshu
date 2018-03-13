import { message } from 'antd';
import { publishCandidateModels, updateCandidateModel, removeCandidateModels, queryCandidateModels } from '../services/modelsAPI';

export default {
  namespace: 'candidatemodels',

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
    *fetchCandidateModelList({ payload }, { call, put }) {
      const response = yield call(queryCandidateModels, payload);
      yield put({
        type: 'saveModelList',
        payload: response,
      });
    },

    *removeCandidateModel({ payload }, { call, put }) {
      const response = yield call(removeCandidateModels, { ids: payload.ids });
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

    *updateCandidateModel({ payload }, { call, put }) {
      const response = yield call(updateCandidateModel, { ...payload });
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

    *publishCandidateModels({ payload }, { call, put }) {
      const response = yield call(publishCandidateModels, { ...payload });
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
