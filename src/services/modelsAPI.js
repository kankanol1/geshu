/**
 * All the apis related to models.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryModels(params) {
  return request(`/api/models/production/list?${stringify(params)}`);
}

export async function removeModels(params) {
  return request('/api/models/production/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateModel(params) {
  return request('/api/models/production/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryCandidateModels(params) {
  return request(`/api/models/candidate/list?${stringify(params)}`);
}

export async function removeCandidateModels(params) {
  return request('/api/models/candidate/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateCandidateModel(params) {
  return request('/api/models/candidate/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function publishCandidateModels(params) {
  return request('/api/models/candidate/publish', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
export default {
  updateModel,
  removeModels,
  queryModels,
  updateCandidateModel,
  removeCandidateModels,
  queryCandidateModels,
  publishCandidateModels,
};
