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

export async function queryDatasetHeatmap(params) {
  return request(`/api/dataset/query/heatmap?${stringify(params)}`);
}

export async function queryDatasetData(params) {
  return request(`/api/dataset/query/data?${stringify(params)}`);
}

export async function queryDatasetHistogram(params) {
  return request(`/api/dataset/query/histogram?${stringify(params)}`);
}

export async function queryPrivateDatasetHeatmap(params) {
  return request(`/api/dataset/private/query/heatmap?${stringify(params)}`);
}

export async function queryPrivateDatasetData(params) {
  return request(`/api/dataset/private/query/data?${stringify(params)}`);
}

export async function queryPrivateDatasetHistogram(params) {
  return request(`/api/dataset/private/query/histogram?${stringify(params)}`);
}

export async function removePrivateDataset(params) {
  return request('/api/dataset/private/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryDataset,
  createDataset,
  removeDataset,
  updateDataset,
  makePrivateDataset,
  makePublicDataset,
  getDatasetSchema,
  queryDatasetData,
  queryDatasetHeatmap,
  queryDatasetHistogram,
};
