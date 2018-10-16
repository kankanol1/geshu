import { message } from 'antd';
import { updateUser, queryCurrent, updatePassword } from '@/services/usersAPI';

export default {
  namespace: 'self',

  state: {
    currentUser: {},
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, { ...payload });
      if (response) {
        if (response.success) {
          message.success(response.message);
          yield put({
            type: 'fetchUserList',
            payload: payload.refreshParams,
          });
        } else {
          // show message.
          message.error(response.message);
        }
      }
    },

    *queryCurrentUser(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'updateState',
          payload: { currentUser: response === undefined ? {} : response },
        });
      }
    },

    *updatePassword({ payload, resolve, reject }, { call }) {
      const response = yield call(updatePassword, payload);
      if (response) {
        if (response.success) {
          message.success(response.message);
          resolve();
        } else {
          // show message.
          message.error(response.message);
          reject();
        }
      }
    },
  },

  subscriptions: {},
};
