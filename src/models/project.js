import { queryProjects, queryProjectLabels, removeProject } from '../services/projectAPI';

export default {
  namespace: 'project',

  state: {
    data: {
      list: [],
      pagination: {},
      labels: [],
    },
  },

  reducers: {
    saveProjectList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },

    saveLabelsList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          labels: payload.list,
        },
      };
    },
  },

  effects: {
    *fetchProjectList({ payload }, { call, put }) {
      const response = yield call(queryProjects, payload);
      yield put({
        type: 'saveProjectList',
        payload: response,
      });
    },

    *fetchLabelsList({ payload }, { call, put }) {
      const response = yield call(queryProjectLabels, payload);
      yield put({
        type: 'saveLabelsList',
        payload: response,
      });
    },

    *removeProject({ payload }, { call, put }) {
      const response = yield call(removeProject, { ids: payload.ids });
      yield put({
        type: 'fetchProjectList',
        payload: payload.refreshParams,
      });
    },

    *init({ payload }, { put }) {
      yield put({
        type: 'fetchProjectList',
      });
      yield put({
        type: 'fetchLabelsList',
      });
    },
  },

  subscriptions: {
  },
};
