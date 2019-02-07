import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllTasks(params) {
  return request(`/api/datapro/client/tasks/list?${stringify(params)}`);
}

export async function createTask(params) {
  return request('/api/datapro/client/tasks/create', {
    method: 'POST',
    body: params,
  });
}

export async function updateTask(params) {
  return request('/api/datapro/client/tasks/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTaskById(params) {
  return request('/api/datapro/client/tasks/delete', {
    method: 'POST',
    body: params,
  });
}
