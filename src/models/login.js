import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { reloadAuthorized } from '../utils/Authorized';
import { userLogin, userLogout } from '../services/usersAPI';
import { getUrlParams, replaceUrlWithParams } from '../utils/conversionUtils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },

    *logout(_, { put, select, call }) {
      const pathname = yield select(state => state.routing.location.pathname);
      // do not redirect twice.
      if (pathname === '/user/login') { return; }
      try {
        // get location pathname
        const url = window.location.href;
        const urlParams = getUrlParams(url);
        // add the parameters in the url
        const redirectPath = replaceUrlWithParams('/#/user/login', { urlParams, redirect: pathname });
        const response = yield call(userLogout);
        if (response.success) {
          message.info(response.message);
        } else {
          message.error(response.message);
        }
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
