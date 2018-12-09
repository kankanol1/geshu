import { inspectDataset } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproInspector',

  state: {
    result: {},
  },

  reducers: {
    saveResult(state, { payload }) {
      return { ...state, result: { ...payload } };
    },

    clearData(state) {
      return { result: {} };
    },
  },

  effects: {
    *inspectData({ payload }, { put, call }) {
      const response = yield call(inspectDataset, { ...payload });
      if (response) {
        yield put({
          type: 'saveResult',
          payload: {
            ...response,
          },
        });
      }
    },
  },
};
