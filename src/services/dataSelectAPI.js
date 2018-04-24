/**
 * All the apis related to project.
 */
import { stringify } from 'qs';
import request from '../utils/request';


export async function queryAllDatabase() {
  return request('/api/dataSelect/all');
}


export default {
  queryAllDatabase,
};
