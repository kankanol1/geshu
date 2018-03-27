import { message } from 'antd';
import { queryUsers, removeUsers, updateUser, createUser, queryUserName, queryCurrentUser, updatePassword } from '../services/usersAPI';


export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    validate: {
      userName: {
        validating: undefined,
        success: true,
        message: '',
      },
    },
    selectedUser: undefined,
    currentUser: {},
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

    beginValidationUserName(state) {
      return {
        ...state,
        validate: {
          ...state.validate,
          userName: {
            ...state.validate.userName,
            validating: true,
          },
        },
      };
    },

    endValidationUserName(state, { payload }) {
      return {
        ...state,
        validate: {
          ...state.validate,
          userName: {
            ...state.validate.userName,
            validating: false,
            ...payload,
          },
        },
      };
    },

    resetValidation(state) {
      return {
        ...state,
        validate: {
          ...state.validate,
          userName: {
            ...state.validate.userName,
            validating: undefined,
            success: true,
            message: '',
          },
        },
      };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
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
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *queryUserName({ payload }, { call, put }) {
      yield put({
        type: 'beginValidationUserName',
      });
      const { userName } = payload;

      if (userName.length < 2) {
        yield put({
          type: 'endValidationUserName',
          payload: {
            success: false,
            message: '至少3个字符',
          },
        });
      } else {
        const response = yield call(queryUserName, { ...payload });
        yield put({
          type: 'endValidationUserName',
          payload: response,
        });
      }
    },

    *queryCurrentUser(_, { call, put }) {
      const response = yield call(queryCurrentUser);
      yield put({ type: 'updateState', payload: { currentUser: response === undefined ? {} : response } });
    },

    *updatePassword({ payload, succeed, failed }, { call }) {
      const response = yield call(updatePassword, ...payload);
      if (response.success) {
        message.success(response.message);
        succeed();
      } else {
      // show message.
        message.error(response.message);
        failed();
      }
    },
  },

  subscriptions: {
  },
};
