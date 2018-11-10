import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllProjects(params) {
  return request(`/api/datapro/projects/list/all?${stringify(params)}`);
}

export async function queryProjectById(id) {
  return request(`/api/datapro/projects/p/info?${stringify({ id })}`);
}

export async function queryProjectCountsById(id) {
  return request(`/api/datapro/projects/p/count?${stringify({ id })}`);
}
export async function queryProjectReadmeById(id) {
  return request(`/api/datapro/projects/p/readme?${stringify({ id })}`);
}

export default {
  queryAllProjects,
  queryProjectById,
  queryProjectCountsById,
  queryProjectReadmeById,
};
