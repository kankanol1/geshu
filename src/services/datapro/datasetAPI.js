import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllDatasets(params) {
  return request(`/api/datapro/datasets/list?${stringify(params)}`);
}

export async function updateDataset(params) {
  return request('/api/datapro/datasets/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteDataset(params) {
  return request('/api/datapro/datasets/delete', {
    method: 'POST',
    body: params,
  });
}

export async function createDataset(params) {
  return request('/api/datapro/datasets/create', {
    method: 'POST',
    body: params,
  });
}

export async function getDatasetInfoForId(params) {
  return request(`/api/datapro/datasets/get?${stringify(params)}`);
}

export async function queryDatasetStatistics(params) {
  return request(`/api/datapro/datasets/query/statistics?${stringify(params)}`);
}

export async function queryDatasetData(params) {
  return request(`/api/datapro/datasets/query/data?${stringify(params)}`);
}

export async function queryDatasetHistogram(params) {
  return request(`/api/datapro/datasets/query/histogram?${stringify(params)}`);
}
