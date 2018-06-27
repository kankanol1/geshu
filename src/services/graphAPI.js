/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function recentGraph() {
  return request('/api/graph/project/recent');
}

export async function saveGraph(params) {
  return request('/api/graph/project/save', {
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
  return request(`/api/graph/project/detail?${stringify(params)}`, {
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

export async function getGremlinQueries(params) {
  return request(`/api/graph/query/list?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function queryGremlinServer(params) {
  return request(`${params.host}`, {
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
  return request(`/api/graph/project/list?${stringify(params)}`);
}
export async function execute(params) {
  return request(`/api/graph/project/execute?${stringify(params)}`);
}
export async function removeProject(params) {
  return request('/api/graph/project/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateProject(params) {
  return request('/api/graph/project/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function createProject(params) {
  return request('/api/graph/project/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateQuery(params) {
  return request('/api/graph/query/update', { method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function saveQuery(params) {
  return request('/api/graph/query/update', { method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function saveAsQuery(params) {
  return request('/api/graph/query/create', {
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

export async function queryProjectLabels() {
  return request('/api/project/labels');
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
  queryProjectLabels,
  saveQuery,
  saveAsQuery,
};
