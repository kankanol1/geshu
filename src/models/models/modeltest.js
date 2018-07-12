import { message } from 'antd';
import { queryModelDetails } from '../../services/modelsAPI';

export default {
  namespace: 'modeltest',

  state: {
    model: {},
  },

  reducers: {
    saveModelInfo(state, { payload }) {
      return {
        ...state,
        model: { ...payload },
      };
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
  },
};
