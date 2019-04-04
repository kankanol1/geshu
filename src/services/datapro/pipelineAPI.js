import { stringify } from 'qs';
import request from '../../utils/request';

export async function getPipeline(params) {
  return request(`/api/datapro/projects/pipeline/get?${stringify(params)}`);
}

export async function queryAllDatasets(params) {
  return request(`/api/datapro/projects/pipeline/datasets?${stringify(params)}`);
}

export async function queryAllObjectiveSchemas(params) {
  return request(`/api/datapro/projects/pipeline/objectiveschemas?${stringify(params)}`);
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

export async function runToOperator(params) {
  return request('/api/datapro/projects/pipeline/op/run', {
    method: 'POST',
    body: params,
  });
}

export async function inspectDataset(params) {
  return request('/api/datapro/projects/pipeline/op/inspect', {
    method: 'POST',
    body: params,
  });
}

export async function getOperatorSchema(params) {
  return request('/api/datapro/projects/pipeline/op/schema', {
    method: 'POST',
    body: params,
  });
}

export async function getOperatorObjectiveSchema(params) {
  return request('/api/datapro/projects/pipeline/op/objectiveschema', {
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

export async function getRegisteredTypes(params) {
  return request('/api/datapro/projects/pipeline/conf/types', {
    method: 'POST',
    body: params,
  });
}

export async function updateType(params) {
  return request('/api/datapro/projects/pipeline/op/typeupdate', {
    method: 'POST',
    body: params,
  });
}

export async function invalidOperator(params) {
  return request('/api/datapro/projects/pipeline/op/invalid', {
    method: 'POST',
    body: params,
  });
}

// transformation.
export async function getTransformationSchema(params) {
  return request('/api/datapro/projects/pipeline/op/trans/schema', {
    method: 'POST',
    body: params,
  });
}

export async function addTransformation(params) {
  return request('/api/datapro/projects/pipeline/op/trans/add', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTransformation(params) {
  return request('/api/datapro/projects/pipeline/op/trans/delete', {
    method: 'POST',
    body: params,
  });
}

export async function previewTransformationResult(params) {
  return request(`/api/datapro/projects/pipeline/op/trans/preview?${stringify(params)}`);
}

export async function publishPipeline(params) {
  return request('/api/datapro/projects/pipeline/publish', {
    method: 'POST',
    body: params,
  });
}

export async function queryPipelinePublishMeta(params) {
  return request(`/api/datapro/projects/pipeline/publish?${stringify(params)}`);
}
