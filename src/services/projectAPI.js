/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjects(params) {
  return request(`/api/project/query?${stringify(params)}`);
}

export async function removeProject(params) {
  return request('/api/project/command', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addProject(params) {
  return request('/api/project/command', {
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryProjectLabels() {
  return request('/api/project/labels');
}
