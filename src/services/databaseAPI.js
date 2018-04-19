/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryDatabase(params) {
  return request(`/api/database/list?${stringify(params)}`);
}

export async function queryAllDatabase() {
  return request('/api/database/all');
}

export async function removeDatabase(params) {
  return request('/api/database/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function makePublicDatabase(params) {
  return request('/api/database/public', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function makePrivateDatabase(params) {
  return request('/api/database/private', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateDatabase(params) {
  return request('/api/database/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createDatabase(params) {
  return request('/api/database/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


export default {
  queryDatabase,
  createDatabase,
  removeDatabase,
  updateDatabase,
  makePrivateDatabase,
  makePublicDatabase,
  queryAllDatabase,
};
