/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryDataset(params) {
  return request(`/api/dataset/list?${stringify(params)}`);
}

export async function removeDataset(params) {
  return request('/api/dataset/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function makePublicDataset(params) {
  return request('/api/dataset/publicize', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function makePrivateDataset(params) {
  return request('/api/dataset/privatize', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateDataset(params) {
  return request('/api/dataset/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createDataset(params) {
  return request('/api/dataset/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getDatasetSchema(params) {
  return request('/api/dataset/schema', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getDatasetInfoForId(params) {
  return request(`/api/dataset/get?${stringify(params)}`);
}

export default {
  queryDataset,
  createDataset,
  removeDataset,
  updateDataset,
  makePrivateDataset,
  makePublicDataset,
  getDatasetSchema,
};
