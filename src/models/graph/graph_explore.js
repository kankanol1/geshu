/* eslint-disable no-param-reassign,guard-for-in,no-useless-escape */

import { message } from 'antd';
import { getGremlinServerAddress, queryGremlinServer } from '../../services/graphAPI';
import GojsRelationGraph from '../../utils/GojsRelationGraph';

function graphson3to1(data) {
  // Convert data from graphSON v2 format to graphSON v1
  if (!(Array.isArray(data) || ((typeof data === 'object') && (data !== null)))) return data;
  if ('@type' in data) {
    if (data['@type'] === 'g:List') {
      data = data['@value'];
      return graphson3to1(data);
    } else if (data['@type'] === 'g:Set') {
      data = data['@value'];
      return data;
    } else if (data['@type'] === 'g:Map') {
      const data_tmp = {};
      for (let i = 0; i < data['@value'].length; i += 2) {
        let data_key = data['@value'][i];
        if ((typeof data_key === 'object') && (data_key !== null)) data_key = graphson3to1(data_key);
        // console.log(data_key);
        if (Array.isArray(data_key)) data_key = JSON.stringify(data_key).replace(/\"/g, ' ');// .toString();
        data_tmp[data_key] = graphson3to1(data['@value'][i + 1]);
      }
      data = data_tmp;
      return data;
    } else {
      data = data['@value'];
      if ((typeof data === 'object') && (data !== null)) data = graphson3to1(data);
      return data;
    }
  } else if (Array.isArray(data) || ((typeof data === 'object') && (data !== null))) {
    for (const key in data) {
      data[key] = graphson3to1(data[key]);
    }
    return data;
  }
  return data;
}

export default {
  namespace: 'graph_explore',
  state: {
    goJsGraph: {},
    host: '',
    port: '',
    id: '',
  },
  reducers: {
    init(state, { payload }) {
      const goJsGraph = new GojsRelationGraph();
      goJsGraph.create(payload);
      return Object.assign({}, {
        ...state,
        goJsGraph,
        id: payload.id,
        host: payload.host,
        port: payload.port,
      });
    },
    setGraph(state, { payload }) {
      state.goJsGraph.clear();
      const data = graphson3to1(payload.result.data);
      state.goJsGraph.mergeData(data);
      return state;
    },
    mergeGraph(state, { payload }) {
      const data = graphson3to1(payload.result.data);
      state.goJsGraph.mergeData(data);
      return state;
    },
  },
  effects: {
    *initialize({ payload }, { call, put }) {
      const response = yield call(getGremlinServerAddress, { id: payload.id });
      yield put({
        type: 'init',
        payload: {
          ...response.data,
          ...payload,
        },
      });
    },
    *searchGraph({ payload }, { call, put, select }) {
      const { host, port, id } = yield select(state => state.graph_explore);
      const { name, value } = payload;
      const response = yield call(queryGremlinServer, {
        code: `nodes=g.V().has('${name}','${value}')
        edges = g.V().
          has('${name}','${value}').
          aggregate('node')
          .outE().as('edge')
          .inV()
          .where(within('node'))
          .select('edge')
        [nodes.toList(),edges.toList()]`,
        id,
        host,
        port,
      });
      if (response.status.code > 200) { message.error(`错误：${response.status.message}`); }
      yield put({
        type: 'setGraph',
        payload: response,
      });
    },
    *exploreGraph({ payload }, { call, put, select }) {
      const { host, port, id } = yield select(state => state.graph_explore);
      const { key } = payload.data;
      const code = `nodes =g.V(${key}).as("node").both().as("node")
        .select(all,"node").inject(g.V(${key})).unfold()
        edges = g.V(${key}).bothE()
        [nodes.toList(),edges.toList()]`;
      const response = yield call(queryGremlinServer, { code, id, host, port });
      yield put({
        type: 'mergeGraph',
        payload: response,
      });
    },
  },
};
