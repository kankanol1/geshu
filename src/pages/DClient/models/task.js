import { queryTaskById } from '@/services/dclient/taskAPI';

export default {
  namespace: 'task',

  state: {
    data: {},
  },

  reducers: {
    saveTask(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },

  effects: {
    *fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTaskById, payload);
      if (response) {
        yield put({
          type: 'saveTask',
          payload: response,
        });
      }
    },
  },
};
