import { routerRedux } from 'dva/router';
import { message } from 'antd';
import graphUtil from '../../utils/graph_utils';
import { getGraph, saveGraph, getDataSources, getDataSourceColumns, execute } from '../../services/graphAPI';

function inverseMap(map) {
  const inversedMap = {};
  for (const key in map) {
    if (key && map[key]) { inversedMap[map[key]] = key; }
  }
  return inversedMap;
}

function formBackendMappingData(diagram) {
  const mappingData = {
    vertexMaps: [],
    edgeMaps: [],
  };
  const linkArr = diagram.model.linkDataArray;
  for (const i in linkArr) {
    if (linkArr[i].category === undefined) {
      const fromNodeKey = diagram.model.getFromKeyForLinkData(linkArr[i]);
      const fromNodeData = diagram.model.findNodeDataForKey(fromNodeKey);
      const toNodeKey = diagram.model.getToKeyForLinkData(linkArr[i]);
      const toNodeData = diagram.model.findNodeDataForKey(toNodeKey);
      const dataMap = {
        edge: toNodeData.text,
        source: {
          path: fromNodeData.text,
          header: true,
          inferSchema: true,
          schema: '',
          type: 'CsvSourceAttribute',
        },
        propertyMapping: inverseMap(linkArr[i].mapping),
      };
      if (toNodeData.originType === 'link') {
        const startNodeData = diagram.model.findNodeDataForKey(toNodeData.from);
        const endNodeData = diagram.model.findNodeDataForKey(toNodeData.to);
        mappingData.edgeMaps.push({
          ...dataMap,
          edgeLeft: {
            edgeField: linkArr[i].start.nodeAttr,
            vertex: startNodeData.text,
            vertexField: linkArr[i].start.column,
          },
          edgeRight: {
            edgeField: linkArr[i].end.nodeAttr,
            vertex: endNodeData.text,
            vertexField: linkArr[i].start.column,
          },
        });
      } else {
        mappingData.vertexMaps.push({
          ...dataMap,
        });
      }
    }
  }
  return mappingData;
}
export default {
  namespace: 'graph_mapping_editor',
  state: {
    id: -1,
    name: '',
    diagram: {},
    frontendJson: '',
    datasources: [],
    datasourceId2Columns: {},
    currentColumns: [],
    loadingColumn: false,
  },
  reducers: {
    init(state, { payload }) {
      const { graphContainer, frontendJson, id, frontendMappingJson, name } = payload;
      const diagram = graphUtil.initMappingDiagram(graphContainer,
        frontendMappingJson || frontendJson,
        !frontendMappingJson);
      return Object.assign({}, {
        ...state,
        diagram,
        id,
        name,
      });
    },
    resetMapping(state) {
      graphUtil.removeDataOfCategory(state.diagram, 'node', 'file');
      graphUtil.removeDataOfCategory(state.diagram, 'link', undefined);
      return state;
    },
    saveDataSources(state, { payload }) {
      return Object.assign({}, {
        ...state,
        datasources: payload,
      });
    },
    addDataSourcesOnGraph(state, { payload }) {
      const fileData = [];
      for (const i in state.datasources) {
        if (payload.indexOf(state.datasources[i].id) >= 0) { fileData.push(state.datasources[i]); }
      }
      graphUtil.addFileNode(state.diagram, fileData);
      return state;
    },
    saveDataSourceColumn(state, { payload }) {
      const newColumns = {};
      newColumns[payload.id] = payload.data;
      return Object.assign({}, {
        ...state,
        datasourceId2Columns: {
          ...state.datasourceId2Columns,
          ...newColumns,
        },
      });
    },
    saveCurrentDataSourceColumn(state, { payload }) {
      const currentColumns = state.datasourceId2Columns[payload];
      return Object.assign({}, {
        ...state,
        currentColumns,
        loadingColumn: false,
      });
    },
    startLoadDataSourceColumn(state, { payload }) {
      return {
        ...state,
        loadingColumn: true,
      };
    },
  },
  effects: {
    *initialize({ payload }, { call, put }) {
      const response = yield call(getGraph, { id: payload.id });
      yield put({
        type: 'init',
        payload: {
          ...response.data,
          ...payload,
        },
      });
      const { data } = yield call(getDataSources);
      yield put({
        type: 'saveDataSources',
        payload: data,
      });
    },
    *getDataSourceColumns({ payload }, { call, put, select }) {
      yield put({
        type: 'startLoadDataSourceColumn',
      });
      const { datasourceId2Columns } =
        yield select(state => state.graph_mapping_editor);
      if (!datasourceId2Columns[payload]) {
        const { data } = yield call(getDataSourceColumns, { id: payload });
        yield put({
          type: 'saveDataSourceColumn',
          payload: {
            id: payload,
            data,
          },
        });
      }
      yield put({
        type: 'saveCurrentDataSourceColumn',
        payload,
      });
    },
    *saveMapping({ payload }, { call, put, select }) {
      const { diagram, id } =
        yield select(state => state.graph_mapping_editor);
      const frontendMappingJson = graphUtil.toJson(diagram);
      const backendMappingData = formBackendMappingData(diagram);
      const backendMappingJson = JSON.stringify(backendMappingData);
      const response = yield call(
        saveGraph, {
          frontendMappingJson,
          backendMappingJson,
          id,
        });

      if (!payload) {
        message.info(response.message);
      } else {
        const execution = yield call(execute, { type: 'mapping', id });
        if (execution.success) { yield put(routerRedux.push('/jobs/list')); } else { message.info(execution.message); }
      }
    },
  },

};

