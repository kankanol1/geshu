import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryAllTemplates(params) {
  return request(`/api/datapro/client/templates/list?${stringify(params)}`);
}
