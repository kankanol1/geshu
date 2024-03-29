/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryJobs(params) {
  return request(`/api/graph/jobs/list?${stringify(params)}`);
}

export async function removeJobs(params) {
  return request('/api/graph/jobs/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cancelJobs(params) {
  return request('/api/graph/jobs/cancel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryJobs,
  cancelJobs,
};
