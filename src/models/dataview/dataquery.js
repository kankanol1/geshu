import copy from 'copy-to-clipboard';
import { message } from 'antd';
import { performDataQuery, performDataQueryTmp } from '../../services/dataQueryAPI';
import { getLatestDatabaseForProject } from '../../services/componentAPI';

export default {
  namespace: 'dataquery',

  state: {
    queryResult: undefined,
    availableComponents: [
      { tableName: 'xxx_ttt_xxx',
        projectId: 1,
        jobId: '233',
        jobStartTime: 'xxxx',
        jobFinishTime: 'yyyy',
        componentName: 'hi',
        schema: [{ name: 'key', type: 'varchar' }, { name: 'value', type: 'varchar' }],
        hideSchema: false,
      },
      { tableName: 'xxx_zzz_xxx',
        projectId: 1,
        jobId: '233',
        jobStartTime: 'xxxx',
        jobFinishTime: 'yzzy',
        componentName: 'hai',
        schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
        hideSchema: true,
      },
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

    toggleItemStatus(state, { payload }) {
      const toggleItem = payload;
      const newComponents = state.availableComponents.map(
        (c) => {
          if (c.tableName === toggleItem.tableName) {
            return { ...c, hideSchema: !c.hideSchema };
          } else {
            return c;
          }
        }
      );
      return { ...state, availableComponents: newComponents };
    },

    copyItemAsSql(state, { payload }) {
      const item = payload;
      copy(`select * from ${item.tableName}`);
      message.success('已复制至剪切板');
      return state;
    },
  },

  effects: {
    *querySQLTmp({ payload }, { call, put }) {
      const response = yield call(performDataQueryTmp, payload);
      yield put({
        type: 'updateQueryResult',
        payload: response,
      });
    },

    *querySQL({ payload }, { call, put }) {
      const response = yield call(performDataQuery, payload);
      yield put({
        type: 'updateQueryResult',
        payload: response,
      });
    },

    *getAvailableDatabases({ payload }, { call, put }) {
      const response = yield call(getLatestDatabaseForProject, payload);
      yield put({
        type: 'updateDatabases',
        payload: response,
      });
    },
  },
};
