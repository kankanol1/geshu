import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllDashboards(params) {
  return request(`/api/datapro/dashboards/list?${stringify(params)}`);
}

export async function updateDashboard(params) {
  return request('/api/datapro/dashboards/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteDashboard(params) {
  return request('/api/datapro/dashboards/delete', {
    method: 'POST',
    body: params,
  });
}

export async function createDashboard(params) {
  return request('/api/datapro/dashboards/create', {
    method: 'POST',
    body: params,
  });
}

export async function getDashboardInfoForId(params) {
  return request(`/api/datapro/dashboards/get?${stringify(params)}`);
}
