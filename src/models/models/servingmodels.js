import { message } from 'antd';
import { queryServingModels, offlineServingModels } from '../../services/modelsAPI';

export default {
  namespace: 'servingmodels',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveModelList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },
  },

  effects: {
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(queryServingModels, payload);
      if (response) {
        yield put({
          type: 'saveModelList',
          payload: response,
        });
      }
    },

    *offlineModel({ payload }, { call, put }) {
      const response = yield call(offlineServingModels, { ids: payload.ids });
      if (response) {
        if (response.success) {
          message.success(response.message);
          yield put({
            type: 'fetchModelList',
            payload: payload.refreshParams,
          });
        } else {
          // show message.
          message.error(response.message);
        }
      }
    },
  },
};
