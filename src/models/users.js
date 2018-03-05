import { message } from 'antd';
import { queryUsers, removeUsers, updateUser, createUser } from '../services/usersAPI';


export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveUsersList(state, { payload }) {
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
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'saveUsersList',
        payload: response,
      });
    },

    *removeUsers({ payload }, { call, put }) {
      const response = yield call(removeUsers, { userNames: payload.userNames });
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
    },

    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, { ...payload });
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
    },

    *createUser({ payload }, { call, put }) {
      const response = yield call(createUser, { ...payload });
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
    },
  },

  subscriptions: {
  },
};
