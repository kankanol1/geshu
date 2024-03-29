import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import P from '../config/UserPrivileges';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    fullScreen: false,
    currentUser: {},
    loadingUser: true,
  },

  effects: {
    *queryCurrentUser({ callback, payload }, { call, put }) {
      // first set loading.
      yield put({
        type: 'saveCurrentUser',
        payload: {
          loadingUser: true,
        },
      });
      // const pathname = yield select(state => state.routing.location.pathname);
      const currentUser = yield fetch('/api/self/info', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => {
          if (response.status !== 200) {
            const error = new Error(response.status);
            error.name = response.status;
            error.response = response;
            throw error;
          } else {
            return response.json();
          }
        })
        .catch(e => {
          if (e.name === 401) {
            message.info('请先登录');
            // redirect.
            router.push('/user/login');
          } else {
            message.info(`服务器错误，状态:${e.name}`);
          }
        });
      if (currentUser) {
        // first save role.
        yield put({
          type: 'saveCurrentUser',
          payload: {
            currentUser: {
              ...currentUser,
              privileges: [P.LOGIN_USER, ...currentUser.privileges],
            },
            loadingUser: false,
          },
        });
        if (callback) {
          callback();
        }
        /** rediret to index */
        const redirect = payload && payload.redirect;

        if (redirect) {
          yield put(routerRedux.push(redirect));
        }
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            loadingUser: false,
          },
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
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

    resetLoading(state) {
      return {
        ...state,
        loadingUser: true,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      let lastPathname;
      history.listen(({ pathname }) => {
        if (pathname.startsWith('/projects/p')) {
          if (!lastPathname || !lastPathname.startsWith('/projects/p')) {
            dispatch({
              type: 'changeFullScreen',
              payload: true,
            });
          }
        } else {
          dispatch({
            type: 'changeFullScreen',
            payload: false,
          });
        }
        lastPathname = pathname;
      });
    },
  },
};
