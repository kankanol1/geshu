import { stringify } from 'qs';
import request from '../../utils/request';

export async function getAvailableComponents(params) {
  return request(`/api/datapro/meta/components`);
}
