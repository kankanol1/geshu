import request from '../utils/request';

export async function fetchComponentSetting(code) {
  return request(`/api/workspace/component_param/${code}`);
}

export async function fetchComponentList() {
  return request('/api/workspace/component_list');
}

export async function openProject(id) {
  return request(`/api/workspace/open/${id}`);
}

export default { fetchComponentSetting, fetchComponentList, openProject };
