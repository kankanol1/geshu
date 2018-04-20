import { message } from 'antd';
import { queryJobs, removeJobs, cancelJobs } from '../../services/graphjobAPI';


export default {
  namespace: 'graph_job',

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

    *cancelJobs({ payload }, { call, put }) {
      const response = yield call(cancelJobs, { ids: payload.ids });
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
