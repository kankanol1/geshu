import { queryAllProjects } from '../../../../services/datapro/projectsAPI';

export default {
  namespace: 'dataproProjects',

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
        data: {
          ...payload,
        },
      };
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
  },
};
