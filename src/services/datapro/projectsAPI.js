import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllProjects(params) {
  return request(`/api/datapro/projects/list/all?${stringify(params)}`);
}

export async function queryProjectById(id) {
  return request(`/api/datapro/projects/get?${stringify({ id })}`);
}

export default {
  queryAllProjects,
  queryProjectById,
};
