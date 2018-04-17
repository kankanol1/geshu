/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryDatabase(params) {
  return request(`/api/database/list?${stringify(params)}`);
}

export async function removeDatabase(params) {
  return request('/api/database/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
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

// export async function queryDatabaseLabels() {
//   return request('/api/database/labels');
// }

export async function queryRecentDatabases() {
  return request('/api/database/recent');
}

export default {
  // queryDatabaseLabels,
  queryDatabase,
  queryRecentDatabases,
  createDatabase,
  removeDatabase,
  updateDatabase,
};
