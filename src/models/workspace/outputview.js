
import { message } from 'antd';
import { queryJobs, removeJobs, cancelJobs } from '../../services/jobsAPI';

export default {
  namespace: 'outputview',

  state: {
    joblist: {},
  },

  reducers: {
    saveJobList(state, { payload }) {
      return { ...state, joblist: payload };
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

    *removeJobs({ payload, callback }, { call, put }) {
      const response = yield call(removeJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        if (callback) callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *cancelJobs({ payload, callback }, { call, put }) {
      const response = yield call(cancelJobs, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        if (callback) callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },
  },
};
