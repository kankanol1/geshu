/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryJobs(params) {
  return request(`/api/graphjob/list?${stringify(params)}`);
}

export async function removeJobs(params) {
  return request('/api/graphjob/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cancelJobs(params) {
  return request('/api/graphjob/cancel', {
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
