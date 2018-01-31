import request from '../../utils/request'

const fetchComponentSetting = (id) => {
    return request(`/api/workspace/component_param/${id}`)
}

const fetchComponentList = () => {
    return request('/api/workspace/component_list')
}

export default {fetchComponentSetting, fetchComponentList}