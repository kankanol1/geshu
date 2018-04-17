import { stringify } from 'qs';
import request from '../utils/request';

export async function listFile(params) {
  return request(`/api/fs/ls?${stringify(params)}`);
}
export async function listFileHead(params) {
  return request(`/api/fs/columns?${stringify(params)}`);
}


export default {
  listFile,
  listFileHead,
};

