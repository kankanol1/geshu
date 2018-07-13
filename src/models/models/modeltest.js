import { queryModelDetails, executeModel } from '../../services/modelsAPI';

export default {
  namespace: 'modeltest',

  state: {
    model: {},
    result: {},
  },

  reducers: {
    saveModelInfo(state, { payload }) {
      return {
        ...state,
        model: { ...payload },
      };
    },
    saveResult(state, { payload }) {
      return {
        ...state,
        result: { ...payload },
      };
    },
    resetResult(state) {
      return { ...state, result: {} };
    },
  },

  effects: {
    *fetchModelInfo({ payload }, { put, call }) {
      const response = yield call(queryModelDetails, payload.id);
      if (response) {
        yield put({
          type: 'saveModelInfo',
          payload: response,
        });
      }
    },

    *execute({ payload }, { put, call }) {
      const { id, params } = payload;
      const response = yield call(executeModel, id, params);
      if (response) {
        yield put({
          type: 'saveResult',
          payload: response,
        });
      }
    },
  },
};
