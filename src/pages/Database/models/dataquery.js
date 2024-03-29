import copy from 'copy-to-clipboard';
import { message } from 'antd';
import { performDataQuery, performDataQueryTmp } from '@/services/dataQueryAPI';
import { getLatestDatabaseForProject, persistDataQuery } from '@/services/databaseAPI';

export default {
  namespace: 'dataquery',

  state: {
    queryResult: undefined,
    availableComponents: [
      // { tableName: 'xxx_ttt_xxx',
      //   projectId: 1,
      //   jobId: '233',
      //   jobStartTime: 'xxxx',
      //   jobFinishTime: 'yyyy',
      //   componentName: 'hi',
      //   schema: [{ name: 'key', type: 'varchar' }, { name: 'value', type: 'varchar' }],
      //   hideSchema: false,
      // },
      // { tableName: 'xxx_zzz_xxx',
      //   projectId: 1,
      //   jobId: '233',
      //   jobStartTime: 'xxxx',
      //   jobFinishTime: 'yzzy',
      //   componentName: 'hai',
      //   schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
      //   hideSchema: true,
      // },
    ],
  },

  reducers: {
    updateQueryResult(state, action) {
      return {
        ...state,
        queryResult: action.payload,
      };
    },

    updateDatabases(state, action) {
      return {
        ...state,
        availableComponents: action.payload,
      };
    },

    clean(state) {
      return {
        ...state,
        queryResult: undefined,
      };
    },

    toggleItemStatus(state, { payload }) {
      const toggleItem = payload;
      const newComponents = state.availableComponents.map(c => {
        if (c.tableName === toggleItem.tableName && c.name === toggleItem.name) {
          return { ...c, hideSchema: !c.hideSchema };
        } else {
          return c;
        }
      });
      return { ...state, availableComponents: newComponents };
    },

    copyItemAsSql(state, { payload }) {
      const item = payload;
      copy(`select * from ${item.tableName}`);
      message.success('已复制至剪切板');
      return state;
    },

    // persistItemAsSql(state, { payload }) {
    //   const item = payload;
    //   // copy(`select * from ${item.tableName}`);
    //   message.success('已持久化于数据库');
    //   return state;
    // },
  },

  effects: {
    *querySQLTmp({ payload }, { call, put }) {
      const response = yield call(performDataQueryTmp, payload);
      if (response) {
        yield put({
          type: 'updateQueryResult',
          payload: response,
        });
      }
    },

    *querySQL({ payload }, { call, put }) {
      const response = yield call(performDataQuery, payload);
      if (response) {
        yield put({
          type: 'updateQueryResult',
          payload: response,
        });
      }
    },

    *persistTable({ payload, callback }, { call, put }) {
      const response = yield call(persistDataQuery, payload);
      if (response) {
        if (response.success) {
          message.info('保存成功');
          yield put({
            type: 'updateDatabases',
            payload: { id: payload.projectId },
          });
          if (callback) {
            callback();
          }
        } else {
          message.info(`保存失败:${response.message}`);
        }
      }
    },

    *getAvailableDatabases({ payload }, { call, put }) {
      const response = yield call(getLatestDatabaseForProject, payload);
      if (response) {
        yield put({
          type: 'updateDatabases',
          payload: response,
        });
      }
    },
  },
};
