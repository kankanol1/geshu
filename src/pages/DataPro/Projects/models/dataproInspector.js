import { inspectDataset, inspectSchema } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproInspector',

  state: {
    result: {},
    schema: {},
  },

  reducers: {
    saveResult(state, { payload }) {
      return { ...state, result: payload };
    },

    saveSchema(state, { payload }) {
      return { ...state, schema: payload };
    },

    clearData(state) {
      return { result: {}, schema: {} };
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
    *inspectSchema({ payload }, { put, call }) {
      const response = yield call(inspectSchema, { ...payload });
      if (response) {
        yield put({
          type: 'saveSchema',
          payload: {
            ...response,
          },
        });
      }
    },
  },
};
