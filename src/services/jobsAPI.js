/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryJobs(params) {
  return request(`/api/jobs/list?${stringify(params)}`);
}

export async function removeJobs(params) {
  return request('/api/jobs/remove', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function stopJobs(params) {
  return request('/api/jobs/stop', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pauseJobs(params) {
  return request('/api/jobs/pause', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function resumeJobs(params) {
  return request('/api/jobs/resume', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function restartJobs(params) {
  return request('/api/jobs/restart', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryJobs,
  resumeJobs,
  pauseJobs,
  stopJobs,
  removeJobs,
  restartJobs,
};
