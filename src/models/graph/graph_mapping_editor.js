
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import graphUtil from '../../utils/graph_utils';
import { getGraph, saveGraph, execute } from '../../services/graphAPI';
import { listFile, listFileHead } from '../../services/fileApi';

const DIAGRAM_NAME = 'graph_mapping';
function inverseMap(map) {
  const inversedMap = {};
  for (const key in map) {
    if (key && map[key]) { inversedMap[map[key]] = key; }
  }
  return inversedMap;
}
function getFileName(path) {
  const list = path.split('/');
  return list[list.length - 1];
}
function getPath(str) {
  const txt = str.replace(/(([a-zA-z0-9]+:\/\/)|(\/)){0,1}((([0-9]{1,3}\.){3}[0-9]{1,3})|(([0-9a-z]+\.)+[0-9a-z]+))(:[0-9]{2,4}){0,1}/i, '');
  return txt;
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
        source: {
          path: fromNodeData.path,
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
          edge: toNodeData.text,
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
          vertex: toNodeData.text,
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
    frontendJson: '',
    diagramName: 'graph_mapping',
    datasources: [],
    datasourceId2Columns: {},
    currentColumns: [],
    loadingColumn: false,
    files: [],
  },
  reducers: {
    init(state, { payload }) {
      const { graphContainer, frontendJson, id, frontendMappingJson, name } = payload;
      const diagram = graphUtil.initMappingDiagram(graphContainer,
        frontendMappingJson || frontendJson,
        !frontendMappingJson);
      graphUtil.registerDiagram(DIAGRAM_NAME, diagram);
      return Object.assign({}, {
        ...state,
        id,
        name,
      });
    },
    resetMapping(state) {
      graphUtil.removeDataOfCategory(graphUtil.getDiagram(DIAGRAM_NAME), 'node', 'file');
      graphUtil.removeDataOfCategory(graphUtil.getDiagram(DIAGRAM_NAME), 'link', undefined);
      return state;
    },
    addDataSourcesOnGraph(state, { payload }) {
      const fileData = [];
      payload.forEach((value) => {
        if (value.path.indexOf('.csv') >= 0) {
          fileData.push({
            name: getFileName(value.path),
            id: value.path,
            path: value.path,
            fileType: value.type,
            projectId: value.projectId,
          });
        }
      });
      graphUtil.addFileNode(graphUtil.getDiagram(DIAGRAM_NAME), fileData);
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
      const allColumns = state.datasourceId2Columns[payload];
      const firstColumnString = allColumns[0] || '';
      const currentColumns = firstColumnString.split(',');
      return Object.assign({}, {
        ...state,
        currentColumns,
        loadingColumn: false,
      });
    },
    startLoadDataSourceColumn(state) {
      return {
        ...state,
        loadingColumn: true,
      };
    },
    mergeFileTree(state, { payload }) {
      let files = [...state.files];
      const { path, response } = payload;

      const newFiles = [];
      response.forEach((value, index) => {
        if (index > 0) {
          newFiles.push({
            ...value,
            path: getPath(value.path),
            key: getPath(value.path),
            children: value.isdir ? [] : undefined,
            title: getFileName(value.path),
          });
        }
      });

      if (path === '/') {
        files = [...newFiles];
      } else {
        const dirList = getPath(path).split('/');
        const findCurrent = (name, list) => {
          let ret;
          list.forEach((item) => {
            if (item.title === name) { ret = item; }
          });
          return ret;
        };
        let current = findCurrent(dirList[1], files);
        dirList.forEach((name, index) => {
          if (current && current.children && index > 1) {
            current = findCurrent(name, current.children);
          }
        });
        current.children = [...newFiles];
      }

      return {
        ...state,
        files,
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
      yield put({
        type: 'loadFile',
        payload: '/',
      });
    },
    *getDataSourceColumns({ payload }, { call, put, select }) {
      const { path, projectId, fileType } = payload;
      yield put({
        type: 'startLoadDataSourceColumn',
      });
      const { datasourceId2Columns } =
        yield select(state => state.graph_mapping_editor);
      if (!datasourceId2Columns[payload]) {
        const data = yield call(listFileHead, {
          path,
          projectId: projectId || '-1',
          type: fileType,
        });
        yield put({
          type: 'saveDataSourceColumn',
          payload: {
            id: path,
            data,
          },
        });
      }
      yield put({
        type: 'saveCurrentDataSourceColumn',
        payload: path,
      });
    },
    *saveMapping({ payload }, { call, put, select }) {
      const diagram = graphUtil.getDiagram(DIAGRAM_NAME);
      const { id } =
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
        if (execution.success) { yield put(routerRedux.push('/graph/jobs')); } else { message.info(execution.message); }
      }
    },

    *loadFile({ payload, resolve, reject }, { call, put }) {
      const response = yield call(listFile, { path: payload });
      if (response) {
        yield put({
          type: 'mergeFileTree',
          payload: {
            path: payload,
            response,
          },
        });
        if (resolve) { resolve(); }
      } else {
        message.error('文件列表获取失败');
        if (reject) { reject(); }
      }
    },
  },

};

