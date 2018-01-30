import component_list from './mock/workspace/component_list'
import {wrapResponse} from './mock/response_wrapper'
import componentParam from './mock/workspace/component_params'
import component_params from './mock/workspace/component_params';

export default {
    'GET /api/users': { users: [1,2] },
    'GET /api/workspace/comonent_list': wrapResponse(component_list),
    'GET /api/workspace/component_param/:id':  (req, res) => {
        res.send(wrapResponse(component_params(req.params.id)))
    }
};
