import request from '../utils/request';

const fetchComponentSetting = (code) => {
  return request(`/api/workspace/component_param/${code}`);
};

const fetchComponentList = () => {
  return request('/api/workspace/component_list');
};

export default { fetchComponentSetting, fetchComponentList };
