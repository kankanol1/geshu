import { queryTeams } from '../../../services/teamsAPI';

export default {
  namespace: 'teams',
  state: {
    teams: [],
  },

  reducers: {
    saveTeams(state, { payload }) {
      return {
        ...state,
        teams: payload,
      };
    },
  },

  effects: {
    *fetchTeams({ payload }, { call, put }) {
      const response = yield call(queryTeams, payload);
      if (response) {
        yield put({
          type: 'saveTeams',
          payload: response,
        });
      }
    },
  },
};
