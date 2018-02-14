const componentList = {
  groups: [
    {
      name: '输入组件',
      key: 'input-group',
      components: [
        // component.
        {
          name: 'csv输入',
          code: 'csv-source',
          type: 'source',
          points: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'data output', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
              metatype: 'output',
              connects: ['datasource-input'],
            },
          ],
        },
        // component.
        {
          name: 'txt输入',
          code: 'csv-source',
          type: 'source',
          points: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'data output', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
              metatype: 'output',
              connects: ['datasource-input'],
            },
          ],
        },
      ],
    },
    {
      name: '数据转换组件',
      key: 'transform-group',
      components: [
        {
          name: '列转换',
          code: 'column-convert',
          type: 'preprocessor',
          points: [
            /*
            * input circles
            */
            {
              id: 'i-1',
              label: 'i',
              hint: 'b', // occurs when hover
              x: 3,
              y: 0.5,
              type: 'datasource-input',
              metatype: 'input',
              connects: ['datasource-output'],
            },
            {
              id: 'o-1',
              label: 'o',
              hint: 'b', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
              metatype: 'output',
              connects: ['datasource-input'],
            },
          ],
        },
        {
          name: '行转换',
          code: 'row-convert',
          type: 'preprocessor',
          points: [
            /*
            * input circles
            */
            {
              id: 'i-1',
              label: 'i',
              hint: 'b', // occurs when hover
              x: 3,
              y: 0.5,
              type: 'datasource-input',
              metatype: 'input',
              connects: ['datasource-output'],
            },
            {
              id: 'o-1',
              label: 'o',
              hint: 'b', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
              metatype: 'output',
              connects: ['datasource-input'],
            },
          ],
        },
      ],
    },
  ],
};

export default componentList;