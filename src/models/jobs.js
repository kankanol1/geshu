import { message } from 'antd';
import { queryJobs, removeJobs, stopJobs, pauseJobs, resumeJobs, restartJobs } from '../services/jobsAPI';


export default {
  namespace: 'jobs',

  state: {
    data: {
      list: [],
      pagination: {},
      labels: [],
    },
    recentProjects: {
      loading: false,
      data: [],
    },
  },

  reducers: {
    saveJobList(state, { payload }) {
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
    *fetchJobList({ payload }, { call, put }) {
      const response = yield call(queryJobs, payload);
      yield put({
        type: 'saveJobList',
        payload: response,
      });
    },

    *removeJobs({ payload }, { call, put }) {
      const response = yield call(removeJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchJobList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *stopJobs({ payload }, { call, put }) {
      const response = yield call(stopJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchJobList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *pauseJobs({ payload }, { call, put }) {
      const response = yield call(pauseJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchJobList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *resumeJobs({ payload }, { call, put }) {
      const response = yield call(resumeJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchJobList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *restartJobs({ payload }, { call, put }) {
      const response = yield call(restartJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchJobList',
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
