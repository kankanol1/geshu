import { queryProjectById } from '../../../../services/datapro/projectsAPI';

export default {
  namespace: 'dataproProject',
  state: {
    project: {},
  },

  reducers: {
    saveProjectFetchResult(state, { payload }) {
      return {
        ...state,
        project: payload,
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
  },
};
