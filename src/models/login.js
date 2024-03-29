import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, userLogout } from '../services/usersAPI';

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response && response.status === 'ok') {
        yield put({
          type: 'global/resetLoading',
        });
        yield put(routerRedux.push('/'));
      }
    },

    *logout({ payload }, { put, select, call }) {
      const pathname = yield select(state => state.routing.location.pathname);
      // do not redirect twice.
      if (pathname === '/user/login') {
        return;
      }
      try {
        // // get location pathname
        // const url = window.location.href;
        // const urlParams = getUrlParams(url);
        // // add the parameters in the url
        // const redirectPath = replaceUrlWithParams('/#/user/login',
        // { urlParams, redirect: pathname });
        const { requestServer } = payload || {};
        if (requestServer) {
          const response = yield call(userLogout);
          if (response) {
            if (response.success) {
              message.info(response.message);
            } else {
              message.error(response.message);
            }
          }
        }
      } finally {
        yield put({
          type: 'global/saveCurrentUser',
          payload: {
            currentUser: {},
          },
        });
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload && payload.status,
      };
    },
  },
};
