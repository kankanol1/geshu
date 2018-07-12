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
    },
  });
}

export async function onlineModel(params) {
  return request('/api/models/serving/online', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryServingModels(params) {
  return request(`/api/models/serving/list?${stringify(params)}`);
}

export async function offlineServingModels(params) {
  return request('/api/models/serving/offline', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryModelDetails(id) {
  return request(`/api/models/get/${id}`, { method: 'GET' });
}

export default {
  updateModel,
  removeModels,
  queryModels,
  updateCandidateModel,
  removeCandidateModels,
  queryCandidateModels,
  publishCandidateModels,
  queryServingModels,
  offlineServingModels,
  queryModelDetails,
};
