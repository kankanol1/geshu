export default {
    namespace: 'work_component_list',
    
    state: {
        groups: [
            // component group.
            {
                name: '输入组件',
                key: 'input-group',
                components: [
                    // component. 
                    {
                        name: 'csv输入',
                        type: 'source',
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
                key: 'transform-group',
                components: [
                    {
                        name: '列转换',
                        type: 'preprocessor',
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

    }


}