import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryTemplates(params) {
  return request(`/api/datapro/templates/list?${stringify(params)}`);
}

export async function updateTemplateById(params) {
  return request('/api/datapro/templates/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTemplateById(params) {
  return request('/api/datapro/templates/delete', {
    method: 'POST',
    body: params,
  });
}

export async function queryTemplateInfo(params) {
  return request(`/api/datapro/templates/info?${stringify(params)}`);
}

export default {
  queryTemplates,
  updateTemplateById,
  deleteTemplateById,
  queryTemplateInfo,
};
