import { getAvailableComponents } from '@/services/datapro/dataproAPI';

export default {
  namespace: 'dataproConfig',

  state: {
    components: {},
  },

  reducers: {
    saveConfig(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *fetchConfig({ payload }, { call, put }) {
      const response = yield call(getAvailableComponents);
      if (response) {
        yield put({
          type: 'saveConfig',
          payload: {
            components: response,
          },
        });
      }
    },
  },
};
