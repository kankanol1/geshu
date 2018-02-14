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
          inputs: [

          ],
          outputs: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'data output', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
            },
          ],
        },
        // component.
        {
          name: 'txt输入',
          code: 'csv-source',
          type: 'source',
          inputs: [

          ],
          outputs: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'data output', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
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
          inputs: [
            {
              /*
              * input circles
              */
              id: 'i-1',
              label: 'i',
              hint: 'b', // occurs when hover
              x: 3,
              y: 0.5,
              connects: ['datasource-output'],
            },
          ],
          outputs: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'b', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
            },
          ],
        },
        {
          name: '行转换',
          code: 'row-convert',
          type: 'preprocessor',
          inputs: [
            /*
            * input circles
            */
            {
              id: 'i-1',
              label: 'i',
              hint: 'b', // occurs when hover
              x: 3,
              y: 0.5,
              connects: ['datasource-output'],
            },
          ],
          outputs: [
            {
              id: 'o-1',
              label: 'o',
              hint: 'b', // occurs when hover
              x: 1,
              y: 0.5,
              type: 'datasource-output',
            },
          ],
        },
      ],
    },
  ],
};

export default componentList;
