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

export async function persistDataQuery(params) {
  return request('/api/data/hive/persist', {
    method: 'POST',
    body: params,
  });
}
