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
export async function createQuery(params) {
  return request('/api/graph/query/create', {
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

export async function getGremlinQueries() {
  return request('/api/graph/queryList', {
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
export async function queryGraphList(params) {
  return request(`/api/graph/graphList?${stringify(params)}`);
}
export async function execute(params) {
  return request(`/api/graph/execute?${stringify(params)}`);
}
export async function removeProject(params) {
  return request('/api/graph/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateProject(params) {
  return request('/api/graph/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function createProject(params) {
  return request('/api/graph/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateQuery(params) {
  return request('/api/graph/query/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeQuery(params) {
  return request('/api/graph/query/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
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
  getGremlinQueries,
  createQuery,
  queryGraphList,
  removeProject,
  updateProject,
  createProject,
  updateQuery,
  removeQuery,
  execute,
};
