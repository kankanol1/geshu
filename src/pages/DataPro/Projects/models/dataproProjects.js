import {
  queryAllProjects,
  queryAllLabels,
  createProject,
} from '../../../../services/datapro/projectsAPI';

export default {
  namespace: 'dataproProjects',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    labels: [],
  },

  reducers: {
    saveQueryResult(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveLabels(state, { payload }) {
      return { ...state, labels: payload };
    },
  },

  effects: {
    *fetchAllProjects({ payload }, { call, put }) {
      const response = yield call(queryAllProjects, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },

    *fetchLabels({ payload }, { call, put }) {
      const response = yield call(queryAllLabels, payload);
      if (response) {
        yield put({
          type: 'saveLabels',
          payload: response,
        });
      }
    },

    *createProject({ payload, callback }, { call, put }) {
      const response = yield call(createProject, payload);
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
  },
};
