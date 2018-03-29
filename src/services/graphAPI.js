/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function recentGraph() {
  return request('/api/graph/recent');
}

export async function saveGraph(params) {
  return request('/api/graph/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getGraph(params) {
  return request(`/api/graph/detail?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function getDataSources() {
  return request('/api/graph/datasource/list');
}

export async function getDataSourceColumns(params) {
  return request(`/api/graph/datasource/columns?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function getGremlinServerAddress() {
  return request('/api/graph/gremlinserver/address', {
    method: 'GET',
  });
}

export async function queryGremlinServer(params) {
  return request(`http://${params.host}:${params.port}`, {
    method: 'POST',
    credentials: null,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: {
      gremlin: params.code,
    },
  });
}

export default {
  recentGraph,
  saveGraph,
  getGraph,
  getDataSources,
  getGremlinServerAddress,
  queryGremlinServer,
};
