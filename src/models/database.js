import { message } from 'antd';
import { queryDatabase, removeDatabase, createDatabase, updateDatabase, queryRecentDatabases, makePublicDatabase, makePrivateDatabase, queryAllDatabase } from '../services/databaseAPI';


export default {
  namespace: 'database',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    recentProjects: {
      loading: false,
      data: [],
    },
    allData: {
      publicList: [],
      privateList: [],
    },
  },

  reducers: {
    saveDatabasetList(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },

    saveAllDataList(state, { payload }) {
      return {
        ...state,
        allData: {
          ...state.allData,
          ...payload,
        },
      };
    },

    saveRecentDatabases(state, { payload }) {
      return {
        ...state,
        recentProjects: {
          data: payload,
          loading: false,
        },
      };
    },

    unloadRecentDatabases(state, { payload }) {
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
    *fetchDatabaseList({ payload }, { call, put }) {
      const response = yield call(queryDatabase, payload);
      yield put({
        type: 'saveDatabasetList',
        payload: response,
      });
    },

    *fetchAllDatabaseList({ payload }, { call, put }) {
      const response = yield call(queryAllDatabase);
      yield put({
        type: 'saveAllDataList',
        payload: response,
      });
    },

    *removeDatabase({ payload }, { call, put }) {
      const response = yield call(removeDatabase, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *makePublicDatabase({ payload }, { call, put }) {
      const response = yield call(makePublicDatabase, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *makePrivateDatabase({ payload }, { call, put }) {
      const response = yield call(makePrivateDatabase, { ids: payload.ids });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *updateDatabase({ payload }, { call, put }) {
      const response = yield call(updateDatabase, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
          payload: payload.refreshParams,
        });
      } else {
        // show message.
        message.error(response.message);
      }
    },

    *createDatabase({ payload, resolve, reject }, { call, put }) {
      const response = yield call(createDatabase, { ...payload });
      if (response.success) {
        message.success(response.message);
        yield put({
          type: 'fetchDatabaseList',
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

    *init({ payload }, { put }) {
      yield put({
        type: 'fetchDatabaseList',
      });
    },
  },

  subscriptions: {
  },
};