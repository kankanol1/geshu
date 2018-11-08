import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllProjects(params) {
  return request(`/api/datapro/projects/list/all?${stringify(params)}`);
}

export default {
  queryAllProjects,
};
