import { message } from 'antd';
import { queryAllDashboards, deleteDashboard } from '@/services/datapro/dashboardAPI';

export default {
  namespace: 'dataproDashboards',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  reducers: {
    saveQueryResult(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },

  effects: {
    *fetchAllDashboards({ payload }, { call, put }) {
      const response = yield call(queryAllDashboards, payload);
      if (response) {
        yield put({
          type: 'saveQueryResult',
          payload: response,
        });
      }
    },

    *deleteDashboard({ payload, callback }, { call, put }) {
      const response = yield call(deleteDashboard, payload);
      if (response) {
        if (response.success) {
          message.info('删除成功');
        } else {
          message.error(response.message);
        }
        callback();
      }
    },
  },
};
