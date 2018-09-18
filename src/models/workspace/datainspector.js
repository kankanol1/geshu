import { inspectData } from '../../services/componentAPI';

export default {
  namespace: 'datainspector',

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
      const response = yield call(inspectData, { ...payload });
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
