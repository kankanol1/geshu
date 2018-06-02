
import fetch from 'dva/fetch';
import { message } from 'antd';
import { reloadAuthorized } from '../utils/Authorized';
import { getUrlParams, replaceUrlWithParams } from '../utils/conversionUtils';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    fullScreen: false,
    role: undefined,
    loadingRole: true,
  },

  effects: {
    *fetchUserRole({ payload }, { select, put }) {
      // first set loading.
      yield put({
        type: 'saveUserRole',
        payload: {
          loadingRole: true,
        },
      });
      // const pathname = yield select(state => state.routing.location.pathname);
      const role = yield fetch('/api/self/info', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      }).then((response) => {
        if (response.status !== 200) {
          const error = new Error(response.status);
          error.name = response.status;
          error.response = response;
          throw error;
        } else {
          return response.json();
        }
      }).then((response) => {
        if (response.role === 'admin') {
          return 'user';
        }
        return response.role;
      }).catch((e) => {
        if (e.name === 401) {
          message.info('请先登录');
        } else {
          message.info(`服务器错误，状态:${e.name}`);
        }
        return 'guest';
      });
      // first save role.
      yield put({
        type: 'saveUserRole',
        payload: {
          role,
        },
      });
      // then reload.
      reloadAuthorized();
      // last set loading.
      yield put({
        type: 'saveUserRole',
        payload: {
          loadingRole: false,
        },
      });
    },
  },

  reducers: {
    saveUserRole(state, { payload }) {
      return { ...state, ...payload };
    },

    changeFullScreen(state, { payload }) {
      return {
        ...state,
        fullScreen: payload,
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },

  },

  subscriptions: {
  },
};
