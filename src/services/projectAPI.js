/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjects(params) {
  return request(`/api/project/list?${stringify(params)}`);
}

export async function removeProject(params) {
  return request('/api/project/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateProject(params) {
  return request('/api/project/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createProject(params) {
  return request('/api/project/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProjectLabels() {
  return request('/api/project/labels');
}

export async function queryRecentProjects() {
  return request('/api/project/recent');
}

export default {
  queryProjectLabels,
  queryProjects,
  queryRecentProjects,
  createProject,
  removeProject,
  updateProject,
};
