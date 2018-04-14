import { performDataQuery } from '../../services/dataQueryAPI';

export default {
  namespace: 'dataquery',

  state: {
    queryResult: undefined,
  },

  reducers: {
    updateQueryResult(state, action) {
      return {
        ...state,
        queryResult: action.payload,
      };
    },
  },

  effects: {
    *querySQL({ payload }, { call, put }) {
      const response = yield call(performDataQuery, payload);
      yield put({
        type: 'updateQueryResult',
        payload: response,
      });
    },
  },
};
