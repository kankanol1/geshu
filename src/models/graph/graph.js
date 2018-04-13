import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { recentGraph, queryGraphList, removeProject, updateProject, createProject, queryProjectLabels } from '../../services/graphAPI';

export default {
  namespace: 'graph',

  state: {
    recentGraph: {
      loading: false,
      data: [],
    },
    data: {
      list: [],
      pagination: {},
      labels: [],
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
    saveProjectList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },
    saveLabelsList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          labels: payload.list,
        },
      };
    },
  },
  effects: {
    *fetchRecent({ payload }, { call, put }) {
      const response = yield call(recentGraph);
      yield put({
        type: 'saveRecent',
        payload: response,
      });
    },
    *fetchProjectList({ payload }, { call, put }) {
      const response = yield call(queryGraphList, payload);
      yield put({
        type: 'saveProjectList',
        payload: response,
      });
    },
    *init({ payload }, { put }) {
      yield put({
        type: 'fetchProjectList',
      });
    },
    *removeProject({ payload }, { call, put }) {
      const response = yield call(removeProject, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchProjectList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },
    *updateProject({ payload }, { call, put }) {
      const response = yield call(updateProject, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchProjectList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },
    *createProject({ payload, resolve, reject }, { call, put }) {
      const response = yield call(createProject, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchProjectList',
          payload: payload.refreshParams,
        });
        if (resolve !== undefined) {
          resolve(response);
        }
      } else {
      // show message.
        message.error(response.message);
        if (reject !== undefined) {
          reject(response);
        }
      }
    },
    *createAndRedirect({ payload }, { call, put }) {
      const response = yield call(createProject, { ...payload });
      if (response.success) {
        yield put(routerRedux.push(`/graph/detail/${payload.redirect}/${response.message}`));
      } else {
      // show message.
        message.error(response.message);
      }
    },

    *fetchLabelsList({ payload }, { call, put }) {
      const response = yield call(queryProjectLabels, payload);
      yield put({
        type: 'saveLabelsList',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
