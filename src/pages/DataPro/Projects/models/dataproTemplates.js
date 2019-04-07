import { message } from 'antd';
import {
  queryTemplates,
  updateTemplateById,
  deleteTemplateById,
} from '../../../../services/datapro/templatesAPI';

export default {
  namespace: 'dataproTemplates',
  state: {
    data: {},
  },

  reducers: {
    saveTemplateFetchResult(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },

  effects: {
    *fetchTemplates({ payload }, { call, put }) {
      const response = yield call(queryTemplates, payload);
      if (response) {
        yield put({
          type: 'saveTemplateFetchResult',
          payload: response,
        });
      }
    },
    *updateTemplate({ payload, callback }, { call, put }) {
      const response = yield call(updateTemplateById, payload);
      if (response) {
        if (response.success) {
          message.info('更新成功');
          if (callback) callback();
        } else {
          message.error('更新失败，请重试');
        }
      }
    },
    *deleteTemplate({ payload, callback }, { call, put }) {
      const response = yield call(deleteTemplateById, payload);
      if (response) {
        if (response.success) {
          message.info('删除成功');
          if (callback) callback();
        } else {
          message.error('删除失败，请重试');
        }
      }
    },
  },
};
