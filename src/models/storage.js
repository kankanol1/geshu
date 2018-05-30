import { queryProjectsForFile, queryFileForType } from '../services/storageAPI';

export default {
  namespace: 'storage',

  state: {
    /** list all the projects */
    projects: [],
    files: [],
  },

  reducers: {
    saveProjectList(state, { payload }) {
      return {
        ...state,
        projects: payload,
      };
    },

    saveFileList(state, { payload }) {
      return {
        ...state,
        files: payload,
      };
    },
  },

  effects: {
    *fetchProjectsForFile({ payload, callback }, { call, put }) {
      const response = yield call(queryProjectsForFile);
      yield put({
        type: 'saveProjectList',
        payload: response,
      });
      if (callback !== undefined) {
        yield callback();
      }
    },

    *fetchFileListForType({ payload, callback }, { call, put }) {
      const response = yield call(queryFileForType, payload);
      yield put({
        type: 'saveFileList',
        payload: response,
      });
      if (callback !== undefined) {
        yield callback();
      }
    },
  },
};
