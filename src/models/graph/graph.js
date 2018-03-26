import { message } from 'antd';
import { recentGraph } from '../../services/graphAPI';


export default {
  namespace: 'graph',

  state: {
    recentGraph: {
      loading: false,
      data: [],
    },
  },

  reducers: {
    saveRecent(state, { payload }) {
      return {
        ...state,
        recentGraph: {
          data: payload,
          loading: false,
        },
      };
    },
    resetRecent(state, { payload }) {
      return {
        ...state,
        recentGraph: {
          data: [],
          loading: true,
        },
      };
    },
  },
  effects: {
    * fetchRecent({ payload }, { call, put }) {
      const response = yield call(recentGraph);
      yield put({
        type: 'saveRecent',
        payload: response,
      });
    },
  },

  subscriptions: {},
};
