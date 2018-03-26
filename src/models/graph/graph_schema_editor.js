import { message } from 'antd';
import graphUtil from '../../utils/graph_utils';
import { getGraph, saveGraph } from '../../services/graphAPI';

function formPropertyKeys(nodeProps, linkProps) {
  const propertyKeys = [];
  const propertyNames = [];
  const formDataProps = (dataProps) => {
    for (const propName in dataProps) {
      if (propertyNames.indexOf(propName) < 0) {
        propertyKeys.push({
          name: dataProps[propName].name,
          dataType: dataProps[propName].type,
          cardinality: dataProps[propName].cardinality,
        });
        propertyNames.push(propName);
      }
    }
  };
  formDataProps(nodeProps);
  formDataProps(linkProps);
  return propertyKeys;
}

function formVertexLabels(nodeArr) {
  const vertexLabels = [];
  for (const i in nodeArr) {
    if (nodeArr[i].text) {
      vertexLabels.push({
        name: nodeArr[i].text,
        partition: nodeArr[i].partition === true,
        useStatic: nodeArr[i].useStatic === true,
      });
    }
  }
  return vertexLabels;
}

function formEdgeLabels(linkArr) {
  const edgeLabels = [];
  for (const i in linkArr) {
    if (linkArr[i].text) {
      edgeLabels.push({
        name: linkArr[i].text,
        multiplicity: linkArr[i].multiplicity ? linkArr[i].multiplicity : 'MULTI',
        unidirected: linkArr[i].unidirected !== false,
        signatures: [],
      });
    }
  }
  return edgeLabels;
}

function formIndexes(indexArr) {
  const indexes = {
    vertexIndexes: [],
    edgeIndexes: [],
  };
  for (const i in indexArr) {
    if (indexArr[i].name) {
      const index = {
        name: indexArr[i].name,
        propertyKeys: indexArr[i].properties,
        composite: indexArr[i].config === 'composite',
        unique: indexArr[i].config === 'unique',
        mixedIndex: indexArr[i].config === 'mixed',
        indexOnly: '',
      };
      if (indexArr[i].type === 'node') {
        indexes.vertexIndexes.push(index);
      } else {
        indexes.edgeIndexes.push(index);
      }
    }
  }
  return indexes;
}


function getPropMap(dataArr) {
  const propKey2PropData = {};
  for (const i in dataArr) {
    if (dataArr[i].attrList) {
      for (const j in dataArr[i].attrList) {
        if (!propKey2PropData[dataArr[i].attrList[j].name]) {
          propKey2PropData[dataArr[i].attrList[j].name] = { ...dataArr[i].attrList[j] };
        }
      }
    }
  }
  return propKey2PropData;
}

export default {
  namespace: 'graph_schema_editor',
  state: {
    id: -1,
    diagram: {},
    indexData: {
      indexes: [],
      indexModal: false,
      currentIndexData: {},
      currentIndexId: -1,
    },
  },
  reducers: {
    init(state, { payload }) {
      const { palletContainer, graphContainer, frontendJson, id, indexJson } = payload;
      const diagram = graphUtil.init(palletContainer, graphContainer);
      if (frontendJson) graphUtil.fromJson(diagram, frontendJson);
      let indexes = [];
      if (indexJson) indexes = JSON.parse(indexJson);
      return Object.assign({}, { ...state,
        diagram,
        id,
        indexData: {
          ...state.indexData,
          indexes,
        },
      });
    },
    showIndexModal(state, { payload }) {
      const { id } = payload;
      const { indexes } = state.indexData;
      return Object.assign({}, { ...state,
        indexData: {
          indexModal: true,
          currentIndexData: id >= 0 ? indexes[id] : {},
          currentIndexId: id,
          indexes,
        },
      });
    },
    hideIndexModal(state, { payload }) {
      return Object.assign({}, { ...state,
        indexData: {
          ...state.indexData,
          indexModal: false,
        },
      });
    },
    saveOrUpdateIndex(state, { payload }) {
      const { indexes, currentIndexId } = state.indexData;
      if (currentIndexId < 0) indexes.push(payload);
      else indexes[currentIndexId] = payload;
      return Object.assign({}, { ...state,
        indexData: {
          indexModal: false,
          currentIndexData: {},
          currentIndexId: -1,
          indexes: [].concat(indexes),
        },
      });
    },
    deleteIndex(state, { payload }) {
      state.indexData.indexes.splice(payload.id, 1);
      return Object.assign({}, {
        ...state,
        indexData: {
          ...state.indexData,
          indexes: [].concat(state.indexData.indexes),
        } });
    },
    clearSchema(state) {
      graphUtil.clear(state.diagram);
      state.diagram.clear();
      return Object.assign({}, {
        ...state,
        indexData: {
          ...state.indexData,
          indexes: [],
        } });
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
    },
    *saveSchema({ payload }, { call, select }) {
      const { diagram, indexData, id } =
        yield select(state => state.graph_schema_editor);
      const frontendJson = graphUtil.toJson(diagram);
      const nodeArr = graphUtil.allNodes(diagram);
      const linkArr = graphUtil.allLinks(diagram);
      const nodeProps = getPropMap(nodeArr);
      const linkProps = getPropMap(linkArr);
      const graphSchema = {
        propertyKeys: formPropertyKeys(nodeProps, linkProps),
        vertexLabels: formVertexLabels(nodeArr),
        edgeLabels: formEdgeLabels(linkArr),
        vertexCentricIndexes: [],
        ...formIndexes(indexData.indexes),
      };
      const backendJson = JSON.stringify(graphSchema);
      const indexJson = JSON.stringify(indexData.indexes);
      const response = yield call(
        saveGraph, {
          frontendJson,
          backendJson,
          indexJson,
          id,
        });
      message.info(response.message);
    },
  },

};

