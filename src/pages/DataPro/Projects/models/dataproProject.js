import { message } from 'antd';
import {
  queryProjectById,
  queryProjectCountsById,
  queryProjectReadmeById,
  queryProjectVersionsById,
  updateProjectLabelsById,
  updateProjectById,
  updateProjectReadmeById,
} from '../../../../services/datapro/projectsAPI';

export default {
  namespace: 'dataproProject',
  state: {
    project: {},
    counts: {},
    readme: undefined,
    versions: [],
  },

  reducers: {
    saveProjectFetchResult(state, { payload }) {
      return {
        ...state,
        project: payload,
      };
    },
    saveProjectCount(state, { payload }) {
      return {
        ...state,
        counts: payload,
      };
    },
    saveProjectReadme(state, { payload }) {
      return {
        ...state,
        readme: payload,
      };
    },
    saveProjectVersions(state, { payload }) {
      return {
        ...state,
        versions: payload,
      };
    },
    saveProjectLabels(state, { payload }) {
      return { ...state, project: { ...state.project, labels: payload } };
    },
  },

  effects: {
    *fetchProject({ payload }, { call, put }) {
      const response = yield call(queryProjectById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectFetchResult',
          payload: response,
        });
      }
    },
    *fetchProjectCount({ payload }, { call, put }) {
      const response = yield call(queryProjectCountsById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectCount',
          payload: response,
        });
      }
    },
    *fetchProjectReadme({ payload }, { call, put }) {
      const response = yield call(queryProjectReadmeById, payload.id);
      if (response) {
        yield put({
          type: 'saveProjectReadme',
          payload: response.md,
        });
      }
    },
    *fetchProjectVersions({ payload }, { call, put }) {
      const response = yield call(queryProjectVersionsById, payload);
      if (response) {
        yield put({
          type: 'saveProjectVersions',
          payload: response,
        });
      }
    },
    *updateProjectLabels({ payload }, { call, put }) {
      const response = yield call(updateProjectLabelsById, payload);
      if (response) {
        if (response.success) {
          message.info('更新成功');
          yield put({
            type: 'saveProjectLabels',
            payload: response.data,
          });
        } else {
          message.error('更新失败，请重试');
        }
      }
    },
    *updateProject({ payload }, { call, put }) {
      const response = yield call(updateProjectById, payload);
      if (response) {
        if (response.success) {
          message.info('更新成功');
          yield put({
            type: 'fetchProject',
            payload,
          });
        } else {
          message.error('更新失败，请重试');
        }
      }
    },
    *updateProjectReadme({ payload }, { call, put }) {
      const response = yield call(updateProjectReadmeById, payload);
      if (response) {
        if (response.success) {
          message.info('更新成功');
          yield put({
            type: 'fetchProjectReadme',
            payload: { id: payload.id },
          });
        } else {
          message.error(response.message);
        }
      }
    },
  },
};
