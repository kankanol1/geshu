/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryJobs(params) {
  return request(`/api/jobs/list?${stringify(params)}`);
}

export async function queryJobsByProjectId(params) {
  return request(`/api/jobs/listbypid?${stringify(params)}`);
}

export async function removeJobs(params) {
  return request('/api/jobs/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cancelJobs(params) {
  return request('/api/jobs/cancel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getJobDetails(params) {
  return request(`/api/jobs/detail?${stringify(params)}`);
}

export default {
  queryJobs,
  cancelJobs,
  getJobDetails,
  queryJobsByProjectId,
};
