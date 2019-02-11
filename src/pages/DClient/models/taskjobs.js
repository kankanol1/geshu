import { queryAllJobs } from '@/services/dclient/taskJobsAPI';

export default {
  namespace: 'taskjobs',

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
        data: payload,
      };
    },
    saveLabels(state, { payload }) {
      return { ...state, labels: payload };
    },
  },

  effects: {
    *fetchAllJobs({ payload }, { call, put }) {
      const response = yield call(queryAllJobs, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },
  },
};
