import request from '../utils/request';

export async function performDataQuery(params) {
  return request('/api/data/hive/querytmp', {
    method: 'POST',
    body: params,
  });
}
