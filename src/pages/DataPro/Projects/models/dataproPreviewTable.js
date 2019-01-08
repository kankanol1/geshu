import { previewTransformationResult } from '@/services/datapro/pipelineAPI';

export default {
  namespace: 'dataproPreviewTable',

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
    *preview({ payload }, { put, call }) {
      const response = yield call(previewTransformationResult, { ...payload });
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
