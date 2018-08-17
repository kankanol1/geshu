import { queryTableHeatmap, queryTableHistogram, queryTableData } from '../services/dataQueryAPI';

export default {
  namespace: 'databasedetail',

  state: {
    tableData: undefined,
    heatmap: {
      // data, cols.
    },
    histogram: undefined,
  },

  reducers: {

    saveHeatmap(state, { payload }) {
      return { ...state, heatmap: { ...payload } };
    },

    saveHistogram(state, { payload }) {
      return { ...state, histogram: { ...payload } };
    },

    saveData(state, { payload }) {
      return { ...state, tableData: { ...payload } };
    },

    clearData() {
      return {
        tableData: undefined,
        heatmap: {},
        histogram: undefined,
      };
    },
  },

  effects: {
    *fetchData({ payload }, { call, put }) {
      const response = yield call(queryTableData);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },

    *fetchHistogram({ payload }, { call, put }) {
      const response = yield call(queryTableHistogram);
      yield put({
        type: 'saveHistogram',
        payload: response,
      });
    },

    *fetchHeatmap({ payload }, { call, put }) {
      const response = yield call(queryTableHeatmap);
      // handle response.
      const { columns, values } = response;
      const converted = [];
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[0].length; j++) {
          converted.push({
            c1: i,
            c2: j,
            value: parseFloat(values[i][j]),
          });
        }
      }
      const cols = {
        c1: {
          type: 'cat',
          values: columns,
        },
        c2: {
          type: 'cat',
          values: columns,
        },
      };
      yield put({
        type: 'saveHeatmap',
        payload: {
          data: converted,
          cols,
        },
      });
    },
  },
};
