/** mock: get all the params of a component. */

const allComponents = {
    'csv-source': {
        required: [
            {
                key: 'path',
                description: 'csv文件',
                type: 'string',
                validator: '(s) => true',
            }
        ],
        optional: [
            {
                key: 'spliter',
                description: '分隔符',
                type: 'string',
                validator: '(s) => s.length === 1',
                default: ',',
            }
        ]
    }
}

const componentParam = (id) => {
    return allComponents[id]
}

export default componentParam;