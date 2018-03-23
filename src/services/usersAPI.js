/**
 * All the apis related to users.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryUsers(params) {
  return request(`/api/users/list?${stringify(params)}`);
}

export async function removeUsers(params) {
  return request('/api/users/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateUser(params) {
  return request('/api/users/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createUser(params) {
  return request('/api/users/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryUserName(params) {
  return request(`/api/users/username?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function queryCurrentUser() {
  return request('/api/self/info');
}

export async function updatePassword(params) {
  return request('/api/self/password', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
