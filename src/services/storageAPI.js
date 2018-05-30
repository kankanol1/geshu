import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectsForFile(params) {
  return request('/api/fs/projectsls');
}

export async function queryFileForType(params) {
  return request(`/api/fs/ls4type?${stringify(params)}`);
}

export default {
  queryProjectsForFile,
  queryFileForType,
};
