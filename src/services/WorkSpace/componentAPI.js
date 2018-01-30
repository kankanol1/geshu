import request from '../../utils/request'

const fetchComponentSetting = (id) => {
    return request(`/api/workspace/component_param/${id}`)
}

export default {fetchComponentSetting}