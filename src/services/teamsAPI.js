import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTeams(params) {
  return request(`/api/teams/list?${stringify(params)}`);
}

export default {
  queryTeams,
};
