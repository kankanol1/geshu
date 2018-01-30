const component_list = {
    groups: [
        {
            name: '输入组件',
            key: 'input-group',
            component: [
                // component. 
                {
                    name: 'csv输入',
                    id: 'csv-source',
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
                },
                // component. 
                {
                    name: 'txt输入',
                    id: 'txt-source',
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
                },
            ]
        },
        {
            name: '数据转换组件',
            key: 'transform-group',
            components: [
                {
                    name: '列转换',
                    id: 'column-convert',
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
                },
                {
                    name: '行转换',
                    id: 'row-convert',
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
    ]
}

export default component_list;