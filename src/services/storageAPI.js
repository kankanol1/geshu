import { stringify } from 'qs';
import request from '../utils/request';

export async function queryGraphProjectsForFile() {
  return request('/api/fs/graph/projectls');
}

export async function queryPipelineProjectsForFile() {
  return request('/api/fs/pipeline/projectls');
}

export async function queryRegisteredTypes() {
  return request('/api/fs/registered');
}

export async function queryFileForType(params) {
  return request(`/api/fs/ls4type?${stringify(params)}`);
}

export default {
  queryGraphProjectsForFile,
  queryPipelineProjectsForFile,
  queryFileForType,
  queryRegisteredTypes,
};
