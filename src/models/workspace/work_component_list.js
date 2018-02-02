import componentAPI from "../../services/WorkSpace/componentAPI";

export default {
    namespace: 'work_component_list',
    
    state: {
        groups: [
            // component group.
            {
                name: '输入组件',
                key: 'source',
                components: [
                    // component. 
                    {
                        name: 'csv输入',
                        type: 'source',
                        code: 'csv-source',
                        points: [
                            {
                                id:'o-1',
                                label: 'o',
                                hint: 'data output', // occurs when hover
                                x: 1,
                                y: 0.5,
                                type: 'datasource-output',
                                metatype: 'output',
                                connects: ['datasource-input']
                            }
                        ]
                    }
                ]
            },
            {
                name: '数据转换组件',
                key: 'transform',
                components: [
                    {
                        name: '列转换',
                        type: 'preprocessor',
                        code: 'column-transform',
                        points: [
                             /*input circles*/
                            {
                                id:'i-1',
                                label: 'i',
                                hint: 'b', // occurs when hover
                                x: 3,
                                y: 0.5,
                                type: 'datasource-input',
                                metatype: 'input',
                                connects: ['datasource-output']
                            },
                            {
                                id:'o-1',
                                label: 'o',
                                hint: 'b', // occurs when hover
                                x: 1,
                                y: 0.5,
                                type: 'datasource-output',
                                metatype: 'output',
                                connects: ['datasource-input']
                            }
                        ]
                    }
                ]
            }
        ],
        activekeys: ['input-group', 'transform-group']
    },

    reducers: {

        replaceComponentList(state, {data}) {
            console.log('data,', data)
            const activekeys = data.groups.map(
                (group) => group.key
            )
            let ns =  Object.assign({}, {...state, ...{groups: data.groups, activekeys} })
            console.log('after:', ns)
            return ns
        }
    },

    effects: {
        *featchComponentList({payload}, {call, put}) {
            console.log('featching component list')
            const data = yield call(componentAPI.fetchComponentList);
            console.log('fetched component list', data)
            yield put({type: 'replaceComponentList', data: data.data })
        }
    },

    subscriptions: {
        setup({history, dispatch}, done) {
            dispatch({
                type: 'featchComponentList'
            });
        }
    }

}