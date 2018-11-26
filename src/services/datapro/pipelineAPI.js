import { stringify } from 'qs';
import request from '../../utils/request';

export async function getPipeline(params) {
  return request(`/api/datapro/projects/pipeline/get?${stringify(params)}`);
}

export async function queryAllDatasets(params) {
  return request(`/api/datapro/projects/pipeline/datasets?${stringify(params)}`);
}

export async function addOperator(params) {
  return request('/api/datapro/projects/pipeline/op/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addSourceOperator(params) {
  return request('/api/datapro/projects/pipeline/op/addsource', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
