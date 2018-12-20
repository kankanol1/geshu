import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllProjects(params) {
  return request(`/api/datapro/projects/list/all?${stringify(params)}`);
}

export async function queryAllLabels() {
  return request('/api/datapro/projects/labels');
}

export async function createProject(params) {
  return request('/api/datapro/projects/create', {
    method: 'POST',
    body: params,
  });
}

export async function updateProjectById(params) {
  return request('/api/datapro/projects/update', {
    method: 'POST',
    body: params,
  });
}

export async function queryProjectById(id) {
  return request(`/api/datapro/projects/p/info?${stringify({ id })}`);
}

export async function queryProjectCountsById(id) {
  return request(`/api/datapro/projects/p/count?${stringify({ id })}`);
}

export async function queryProjectReadmeById(id) {
  return request(`/api/datapro/projects/p/readme?${stringify({ id })}`);
}

export async function queryProjectVersionsById(params) {
  return request(`/api/datapro/projects/p/versions?${stringify(params)}`);
}

export async function updateProjectLabelsById(params) {
  return request('/api/datapro/projects/p/labels', {
    method: 'POST',
    body: params,
  });
}

export async function updateProjectReadmeById(params) {
  return request('/api/datapro/projects/p/readme', {
    method: 'POST',
    body: params,
  });
}

export default {
  queryAllProjects,
  queryProjectById,
  queryProjectCountsById,
  queryProjectReadmeById,
  queryProjectVersionsById,
  queryAllLabels,
  createProject,
  updateProjectById,
};
