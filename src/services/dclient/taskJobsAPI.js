import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllJobs(params) {
  return request(`/api/datapro/client/jobs/list?${stringify(params)}`);
}

export async function queryTaskById(params) {
  return request(`/api/datapro/client/jobs/get?${stringify(params)}`);
}

export async function createTask(params) {
  return request('/api/datapro/client/jobs/create', {
    method: 'POST',
    body: params,
  });
}

export async function updateTask(params) {
  return request('/api/datapro/client/jobs/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTaskById(params) {
  return request('/api/datapro/client/jobs/delete', {
    method: 'POST',
    body: params,
  });
}
