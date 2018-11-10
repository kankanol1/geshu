import {
  queryProjectById,
  queryProjectCountsById,
  queryProjectReadmeById,
} from '../../../../services/datapro/projectsAPI';

export default {
  namespace: 'dataproProject',
  state: {
    project: {},
    counts: {},
    readme: {},
  },

  reducers: {
    saveProjectFetchResult(state, { payload }) {
      return {
        ...state,
        project: payload,
      };
    },
    saveProjectCount(state, { payload }) {
      return {
        ...state,
        counts: payload,
      };
    },
    saveProjectReadme(state, { payload }) {
      return {
        ...state,
        readme: payload,
      };
    },
  },

  effects: {
    *fetchProject({ payload }, { call, put }) {
      const response = yield call(queryProjectById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectFetchResult',
          payload: response,
        });
      }
    },
    *fetchProjectCount({ payload }, { call, put }) {
      const response = yield call(queryProjectCountsById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectCount',
          payload: response,
        });
      }
    },
    *fetchProjectReadme({ payload }, { call, put }) {
      const response = yield call(queryProjectReadmeById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectReadme',
          payload: response.md,
        });
      }
    },
  },
};
