import { message } from 'antd';
import { queryProjects, queryProjectLabels, removeProject, createProject, updateProject, queryRecentProjects } from '../services/projectAPI';


export default {
  namespace: 'project',

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

    saveRecentProjects(state, { payload }) {
      return {
        ...state,
        recentProjects: {
          data: payload,
          loading: false,
        },
      };
    },

    unloadRecentProjects(state, { payload }) {
      return {
        ...state,
        recentProjects: {
          data: [],
          loading: true,
        },
      };
    },

  },

  effects: {
    *fetchProjectList({ payload }, { call, put }) {
      const response = yield call(queryProjects, payload);
      yield put({
        type: 'saveProjectList',
        payload: response,
      });
    },

    *fetchRecentProjects({ payload }, { call, put }) {
      const response = yield call(queryRecentProjects);
      yield put({
        type: 'saveRecentProjects',
        payload: response,
      });
    },

    *fetchLabelsList({ payload }, { call, put }) {
      const response = yield call(queryProjectLabels, payload);
      yield put({
        type: 'saveLabelsList',
        payload: response,
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

    *updateProject({ payload, callback }, { call, put }) {
      const response = yield call(updateProject, { ...payload });
      if (response.success) {
        message.success(response.message);
        if (callback) callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *createProject({ payload, callback }, { call, put }) {
      const response = yield call(createProject, { ...payload });
      if (response.success) {
        message.success(response.message);
        if (callback) callback();
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *init({ payload }, { put }) {
      yield put({
        type: 'fetchProjectList',
      });
      yield put({
        type: 'fetchLabelsList',
      });
    },
  },

  subscriptions: {
  },
};
