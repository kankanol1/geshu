/* eslint-disable no-param-reassign,guard-for-in,no-useless-escape */

import { message } from 'antd';
import { queryGremlinServer, getGraph } from '../../services/graphAPI';
import GojsRelationGraph from '../../utils/GojsRelationGraph';

const GRAPH_NAME = 'graph_explore';
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
    id: '',
    name: '',
    type2Label2Attrs: {
      node: {},
      link: {},
      nodeType: {},
      linkType: {},
    },
    type2Attrs: {
      node: [],
      link: [],
      nodeType: [],
      linkType: [],
    },
    type2Labels: {
      node: [],
      link: [],
      nodeType: [],
      linkType: [],
    },
  },
  reducers: {
    init(state, { payload }) {
      const goJsGraph = new GojsRelationGraph();
      const graphData = JSON.parse(payload.frontendJson);
      let nodeDataArray = [];
      let linkDataArray = [];
      if (graphData) {
        nodeDataArray = [...graphData.nodeDataArray];
        linkDataArray = [...graphData.linkDataArray];
      }
      const type2Label2Attrs = {};
      const type2Attrs = {};
      const type2Labels = {};


      type2Label2Attrs.node = {};
      type2Attrs.node = [];
      type2Labels.node = [];
      type2Label2Attrs.nodeType = {};
      type2Attrs.nodeType = [];
      type2Labels.nodeType = [];
      nodeDataArray.forEach((value) => {
        type2Label2Attrs.node[value.text] = [];
        type2Label2Attrs.nodeType[value.text] = [];
        type2Labels.node.push(value.text);
        value.attrList.forEach(({ name, type }) => {
          if (type2Label2Attrs.node[value.text].indexOf(name) < 0) {
            type2Label2Attrs.node[value.text].push(name);
            type2Label2Attrs.nodeType[value.text].push(type);
          }
          if (type2Attrs.node.indexOf(name) < 0) {
            type2Attrs.node.push(name);
            type2Attrs.nodeType.push(type);
          }
        });
      });

      type2Label2Attrs.link = {};
      type2Attrs.link = [];
      type2Labels.link = [];
      type2Label2Attrs.linkType = {};
      type2Attrs.linkType = [];
      type2Labels.linkType = [];
      linkDataArray.forEach((value) => {
        type2Label2Attrs.link[value.text] = [];
        type2Label2Attrs.linkType[value.text] = [];
        type2Labels.link.push(value.text);
        value.attrList.forEach(({ name, type }) => {
          if (type2Label2Attrs.link[value.text].indexOf(name) < 0) {
            type2Label2Attrs.link[value.text].push(name);
            type2Label2Attrs.linkType[value.text].push(type);
          }
          if (type2Attrs.link.indexOf(name) < 0) {
            type2Attrs.link.push(name);
            type2Attrs.linkType.push(type);
          }
        });
      });

      goJsGraph.create(payload);
      GojsRelationGraph.register(GRAPH_NAME, goJsGraph);
      return Object.assign({}, {
        ...state,
        ...payload,
        type2Label2Attrs,
        type2Attrs,
        type2Labels,
        tableName: payload.tableName ? payload.tableName : state.tableName,
      });
    },
    setGraph(state, { payload }) {
      GojsRelationGraph.getGraph(GRAPH_NAME).clear();
      const data = graphson3to1(payload.result.data);
      GojsRelationGraph.getGraph(GRAPH_NAME).mergeData(data);
      return state;
    },
    mergeGraph(state, { payload }) {
      const data = graphson3to1(payload.result.data);
      GojsRelationGraph.getGraph(GRAPH_NAME).mergeData(data);
      return state;
    },
  },
  effects: {
    *initialize({ payload }, { call, put }) {
      const graphData = yield call(getGraph, { id: payload.id });
      if (graphData) {
        yield put({
          type: 'init',
          payload: {
            ...graphData.data,
            ...payload,
          },
        });
      }
    },
    *searchGraph({ payload }, { call, put, select }) {
      const { id, type2Label2Attrs, type2Attrs, tableName } =
        yield select(state => state.graph_explore);
      const { searchValue, type, limit } = payload;
      // const searchLink =
      //   (label && type2Label2Attrs.link[label]) || (name && type2Attrs.link.indexOf(name) >= 0);

      let code;
      let basicSearch;
      if (searchValue.length <= 1 && type === 'node') {
        basicSearch = 'g.V()';
        searchValue.map((item) => {
          if (item.attr && item.attrData) {
            basicSearch += `.has('${item.attr}',${Number(item.attrData) ? item.attrData : `'${item.attrData}'`})`;
          }
          if (item.type) {
            basicSearch += `.hasLabel('${item.type}')`;
          }
          if (item.attr && item.attrDataMax && item.attrDataMin) {
            basicSearch += `.has('${item.attr}',inside(${item.attrDataMin},${item.attrDataMax}))`;
          }
          // if (item.attr && item.attrDataMin) {
          //   basicSearch += `.has('${item.attr}',${item.attrDataMin}).min()`;
          // }
          return basicSearch;
        });
        basicSearch += `.limit(${limit})`;
      } else if (searchValue.length > 1 && type === 'node') {
        basicSearch = 'g.V().or(';
        searchValue.map((item) => {
          let query = '';
          if (item.type) {
            query += `.hasLabel('${item.type}')`;
          }
          if (item.attr && item.attrData) {
            query += `.has('${item.attr}',${Number(item.attrData) ? item.attrData : `'${item.attrData}'`})`;
          }
          if (item.attr && item.attrDataMax && item.attrDataMin) {
            query += `.has('${item.attr}',inside(${item.attrDataMin},${item.attrDataMax}))`;
          }
          if (query) {
            basicSearch += `__ ${query},`;
          }
          return basicSearch;
        });
        basicSearch += `).limit(${limit})`;
      }
      if (type === 'link') {
        basicSearch = 'g.E().or(';
        searchValue.map((item) => {
          let query = '';
          if (item.type) {
            query += `hasLabel('${item.type}').bothV()`;
          }
          if (item.attr && item.attrData) {
            query += `.has('${item.attr}',${Number(item.attrData) ? item.attrData : `'${item.attrData}'`})`;
          }
          if (item.attr && item.attrDataMax && item.attrDataMin) {
            query += `.has('${item.attr}',inside(${item.attrDataMin},${item.attrDataMax}))`;
          }
          if (query) {
            basicSearch += `${query},`;
          }
          // console.log(basicSearch, 'basicSearch');
          return basicSearch;
        });
        basicSearch += `).limit(${limit})`;
      }
      code = type === 'link' ?
        `edges=${basicSearch}\nnodes=${basicSearch}.bothV()\n` :
        `nodes=${basicSearch}
        edges = ${basicSearch}.
        aggregate('node')
        .outE().as('edge')
        .inV()
        .where(within('node'))
        .select('edge')\n`;
      code += '[nodes.toList(),edges.toList()]';

      const response = yield call(queryGremlinServer, {
        code: !tableName || tableName === 'g' ? code : `g=ConfiguredGraphFactory.open('${tableName}').traversal();${code}`,
        id,
      });
      if (response.status.code > 200) { message.error(`错误：${response.status.message}`); }
      yield put({
        type: 'setGraph',
        payload: response,
      });
    },
    *searchRouteGraph({ payload }, { call, put, select }) {
      const { id, type2Label2Attrs, type2Attrs, tableName } =
        yield select(state => state.graph_explore);
      const { searchValue } = payload;
      let basicSearch;
      if (searchValue.routeRange === 1) {
        basicSearch = `es=g.V().has('${searchValue.beginRouteType}', '${searchValue.beginRouteAttr}','${searchValue.beginRouteData}').repeat(bothE().otherV().simplePath()).until(has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').or().loops().is(${searchValue.routeNum})).has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').path().by(id).limit(1).collectMany{it.grep(org.janusgraph.graphdb.relations.RelationIdentifier)};sg=g.E(es).subgraph(\'sg\').cap(\'sg\').next();sgt=sg.traversal();[sg.traversal().V().toList(),sg.traversal().E().toList()]`;
      } else if (searchValue.routeRange === 2) {
        basicSearch = `es=g.V().has('${searchValue.beginRouteType}', '${searchValue.beginRouteAttr}','${searchValue.beginRouteData}').repeat(bothE().otherV().simplePath()).until(has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').or().loops().is(${searchValue.routeNum})).has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').path().by(id).limit(1).collectMany{it.grep(org.janusgraph.graphdb.relations.RelationIdentifier)};sg=g.E(es).subgraph(\'sg\').cap(\'sg\').next();sgt=sg.traversal();jump=sgt.E().count().next();es1=g.V().has('${searchValue.beginRouteType}', '${searchValue.beginRouteAttr}','${searchValue.beginRouteData}').repeat(bothE().otherV().simplePath()).until(has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').or().loops().is(jump)).has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').path().by(id).collectMany{it.grep(org.janusgraph.graphdb.relations.RelationIdentifier)};sg1=g.E(es1).subgraph(\'sg1\').cap(\'sg1\').next();sgt1=sg1.traversal();[sgt1.V().toList(),sgt1.E().toList()]`;
      } else if (searchValue.routeRange === 3) {
        basicSearch = `es=g.V().has('${searchValue.beginRouteType}', '${searchValue.beginRouteAttr}','${searchValue.beginRouteData}').repeat(bothE().otherV().simplePath()).until(has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').or().loops().is(${searchValue.routeNum})).has('${searchValue.endRouteType}', '${searchValue.endRouteAttr}','${searchValue.endRouteData}').path().by(id).collectMany{it.grep(org.janusgraph.graphdb.relations.RelationIdentifier)};sg=g.E(es).subgraph(\'sg\').cap(\'sg\').next();sgt=sg.traversal();[sg.traversal().V().toList(),sg.traversal().E().toList()]`;
      }
      const code = basicSearch;
      const response = yield call(queryGremlinServer, {
        code: !tableName || tableName === 'g' ? code : `g=ConfiguredGraphFactory.open('${tableName}').traversal();${code}`,
        id,
      });
      if (response.status.code > 200) { message.error(`错误：${response.status.message}`); }
      yield put({
        type: 'setGraph',
        payload: response,
      });
    },
    *exploreGraph({ payload }, { call, put, select }) {
      const { id, tableName } = yield select(state => state.graph_explore);
      const { key } = payload.data;
      const code = `nodes =g.V(${key}).as("node").both().as("node")
        .select(all,"node").inject(g.V(${key})).unfold()
        edges = g.V(${key}).bothE()
        [nodes.toList(),edges.toList()]`;
      const response = yield call(queryGremlinServer, { code: !tableName || tableName === 'g' ? code : `g=${tableName}.traversal();${code}`, id });
      yield put({
        type: 'mergeGraph',
        payload: response,
      });
    },
  },
};
