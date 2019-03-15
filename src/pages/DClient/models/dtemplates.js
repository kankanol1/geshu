import { queryAllTemplates } from '@/services/dclient/templateAPI';

export default {
  namespace: 'dtemplates',

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
    *fetchAllTemplates({ payload }, { call, put }) {
      const response = yield call(queryAllTemplates, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },
  },
};
