
import { message } from 'antd';
import { queryJobs, removeJobs, cancelJobs } from '../../services/jobsAPI';

export default {
  namespace: 'outputview',

  state: {
    joblist: {},
    panes: [],
    defaultPane: 'default',
  },

  reducers: {
    saveJobList(state, { payload }) {
      return { ...state, joblist: payload };
    },

    addPane(state, { payload }) {
      let add = true;
      state.panes.forEach((p) => {
        if (p.title === payload.title) {
          add = false;
        }
      });
      return { ...state,
        panes: add ? [...state.panes, payload] : state.panes,
        defaultPane: payload.title,
      };
    },

    activePane(state, { payload }) {
      return { ...state, defaultPane: payload.title };
    },

    removePane(state, { payload }) {
      const key = payload.title;
      const newPanes = state.panes.filter(i => i.title !== key);
      return { ...state, panes: newPanes, defaultPane: key === state.defaultPane ? 'default' : state.defaultPane };
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
