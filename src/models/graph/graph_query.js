/* eslint-disable no-param-reassign,guard-for-in,no-useless-escape */

import { message } from 'antd';
import { getGremlinServerAddress, queryGremlinServer, getGremlinQueries, saveQuery } from '../../services/graphAPI';
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
function formatJson(json, options) {
  let reg = null;
  let formatted = '';
  let pad = 0;
  const PADDING = '    ';
  options = options || {};
  options.newlineAfterColonIfBeforeBraceOrBracket =
    (options.newlineAfterColonIfBeforeBraceOrBracket === true);
  options.spaceAfterColon = options.spaceAfterColon !== false;
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  } else {
    json = JSON.parse(json);
    json = JSON.stringify(json);
  }
  reg = /([\{\}])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /([\[\]])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /(\,)/g;
  json = json.replace(reg, '$1\r\n');
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, '\r\n');
  reg = /\r\n\,/g;
  json = json.replace(reg, ',');
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ':{');
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ':[');
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ':');
  }
  (json.split('\r\n')).forEach((node, index) => {
    let i = 0;
    let indent = 0;
    let padding = '';

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }

    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }

    formatted += `${padding + node}\r\n`;
    pad += indent;
  }
  );
  return formatted;
}

export default {
  namespace: 'graph_query',
  state: {
    goJsGraph: {},
    code: '',
    host: '',
    port: '',
    loadedCode: false,
    showGraph: true,
    id: '',
    name: '',
    responseJson: '',
    queries: [],
    queryLoading: false,
  },
  reducers: {
    init(state, { payload }) {
      const goJsGraph = new GojsRelationGraph();
      goJsGraph.create(payload);
      return Object.assign({}, {
        ...state,
        ...payload,
        goJsGraph,
        // id: payload.id,
        // host: payload.host,
        // port: payload.port,
        // name: payload.name,
      });
    },
    setGraph(state, { payload }) {
      state.goJsGraph.clear();
      const data = graphson3to1(payload.result.data);
      if (data[0] && Array.isArray(data[0]) && data[0].length > 0 && data[0][0] instanceof Object) {
        state.showGraph = true;
        state.goJsGraph.mergeData(data);
      } else state.showGraph = false;
      return state;
    },
    mergeGraph(state, { payload }) {
      const data = graphson3to1(payload.result.data);
      state.goJsGraph.mergeData(data);
      return state;
    },
    saveCode(state, { payload }) {
      return Object.assign({}, {
        ...state,
        code: payload,
        loadedCode: false,
      });
    },
    saveResponse(state, { payload }) {
      return Object.assign({}, {
        ...state,
        responseJson: formatJson(JSON.stringify(payload)),
      });
    },
    loadQuery(state, { payload }) {
      return Object.assign({}, {
        ...state,
        code: state.queries[payload].query,
        loadedCode: true,
      });
    },
    startLoadQueries(state, { payload }) {
      return Object.assign({}, {
        ...state,
        queryLoading: true,
      });
    },
    saveQueries(state, { payload }) {
      payload.forEach((value, index) => {
        payload[index].index = index;
      });
      return Object.assign({}, {
        ...state,
        queries: payload,
        queryLoading: false,
      });
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
    *saveQuery({ payload }, { call, put, select }) {
      const { id, code } = yield select(state => state.graph_query);
      const response = yield call(saveQuery, {
        id,
        query: code,
        name: payload,
      });
      message.info(response.message);
    },
    *queryGraph({ payload }, { call, put, select }) {
      const { host, port, id, code } = yield select(state => state.graph_query);
      const response = yield call(queryGremlinServer, { code, id, host, port });
      if (response.status.code > 200) { message.error(`错误：${response.status.message}`); }
      yield put({
        type: 'saveResponse',
        payload: response,
      });
      yield put({
        type: 'setGraph',
        payload: response,
      });
    },
    *exploreGraph({ payload }, { call, put, select }) {
      const { host, port, id } = yield select(state => state.graph_query);
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
    *queryList({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.graph_query);
      const response = yield call(getGremlinQueries, { id });
      yield put({
        type: 'saveQueries',
        payload: response.data,
      });
    },
  },
};
