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

export async function saveProject({ id, payload }) {
  return request(`/api/workspace/save/${id}`, {
    method: 'POST',
    body: {
      ...payload,
    },
  });
}

export async function saveComponentSettings({ id, component, payload }) {
  return request(`/api/workspace/saveconf/${id}/${component}`, {
    method: 'POST',
    body: {
      ...payload,
    },
  });
}

export default {
  fetchComponentSetting,
  fetchComponentList,
  openProject,
  saveProject,
  saveComponentSettings,
};
