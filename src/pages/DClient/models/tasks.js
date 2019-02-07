import { queryAllTasks, createTask, deleteTaskById } from '@/services/dclient/taskAPI';

export default {
  namespace: 'tasks',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveQueryResult(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveLabels(state, { payload }) {
      return { ...state, labels: payload };
    },
  },

  effects: {
    *fetchAllTasks({ payload }, { call, put }) {
      const response = yield call(queryAllTasks, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },

    *createTask({ payload, callback }, { call, put }) {
      const response = yield call(createTask, payload);
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },

    *deleteTask({ payload, callback }, { call }) {
      const response = yield call(deleteTaskById, payload);
      if (response && callback) {
        callback(response);
      }
    },
  },
};
