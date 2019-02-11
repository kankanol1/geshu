import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllTasks(params) {
  return request(`/api/datapro/client/tasks/list?${stringify(params)}`);
}

export async function queryTaskById(params) {
  return request(`/api/datapro/client/tasks/get?${stringify(params)}`);
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

export async function runTaskById(params) {
  return request('/api/datapro/client/tasks/run', {
    method: 'POST',
    body: params,
  });
}

export async function configTaskSource(params) {
  return request('/api/datapro/client/tasks/conf/source', {
    method: 'POST',
    body: params,
  });
}

export async function configTaskSink(params) {
  return request('/api/datapro/client/tasks/conf/sink', {
    method: 'POST',
    body: params,
  });
}

export async function validateTaskSource(params) {
  return request('/api/datapro/client/tasks/conf/validate/source', {
    method: 'POST',
    body: params,
  });
}

export async function validateTaskSink(params) {
  return request('/api/datapro/client/tasks/conf/validate/source', {
    method: 'POST',
    body: params,
  });
}
