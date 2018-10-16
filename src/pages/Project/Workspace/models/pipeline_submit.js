import { runPipeline } from '@/services/componentAPI';

export default {
  namespace: 'pipeline_submit',
  state: {
    visible: false,
    loading: true,
    result: {},
  },

  reducers: {
    dismiss(state) {
      return { ...state, visible: false, result: {} };
    },
    show(state) {
      return { ...state, visible: true, loading: true };
    },
    setResult(state, { payload }) {
      const { result } = payload;
      return { ...state, result, loading: false };
    },
  },

  effects: {
    *submitPipeline({ payload }, { put, call }) {
      yield put({
        type: 'show',
      });
      const result = yield call(runPipeline, payload);
      if (result) {
        yield put({
          type: 'setResult',
          payload: { result },
        });
        // also try to fetch job list.
        yield put({
          type: 'workcanvas/fetchJobTips',
          payload: {
            id: payload.id,
          },
        });
      }
    },
  },
};
