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
    body: params,
  });
}

export async function updateOperator(params) {
  return request('/api/datapro/projects/pipeline/op/update', {
    method: 'POST',
    body: params,
  });
}

export async function addSourceOperator(params) {
  return request('/api/datapro/projects/pipeline/op/addsource', {
    method: 'POST',
    body: params,
  });
}

export async function configOperator(params) {
  return request('/api/datapro/projects/pipeline/op/config', {
    method: 'POST',
    body: params,
  });
}

export async function getOperatorInPipeline(params) {
  return request(`/api/datapro/projects/pipeline/op/get?${stringify(params)}`);
}

export async function getOperatorConfig(params) {
  return request(`/api/datapro/projects/pipeline/op/config?${stringify(params)}`);
}

export async function deleteOperator(params) {
  return request('/api/datapro/projects/pipeline/op/delete', {
    method: 'POST',
    body: params,
  });
}

// operator configs
export async function getSchemaFromFile(params) {
  return request('/api/datapro/projects/pipeline/conf/getschema', {
    method: 'POST',
    body: params,
  });
}
