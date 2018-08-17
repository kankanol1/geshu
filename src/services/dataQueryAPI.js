import request from '../utils/request';

export async function performDataQueryTmp(params) {
  return request('/api/data/hive/querytmp', {
    method: 'POST',
    body: params,
  });
}

export async function performDataQuery(params) {
  return request('/api/data/hive/query', {
    method: 'POST',
    body: params,
  });
}

export async function queryTableHeatmap(params) {
  return request('/api/data/base/heatmap', {
    method: 'POST',
    body: params,
  });
}

export async function queryTableData(params) {
  return request('/api/data/base/data', {
    method: 'POST',
    body: params,
  });
}

export async function queryTableHistogram(params) {
  return request('/api/data/base/histogram', {
    method: 'POST',
    body: params,
  });
}
