const projectInfo = {
  name: 'Project-name',
  components: [{
    id: 'input',
    name: 'txt输入',
    code: 'csv-source',
    x: 150,
    y: 100,
    width: 120,
    height: 60,
    /** type means */
    type: 'source',
    inputs: [
    ],
    outputs: [
    /* input circles */
      {
        id: 'o-1',
        label: 'o',
        hint: 'data output', // occurs when hover
        x: 1,
        y: 0.5,
        connects: ['datasource-input'],
      },
    ],
    connectFrom: [
    ],
  },
  {
    id: 'preprocess-1',
    name: '转换',
    code: 'column-transform',
    x: 400,
    y: 100,
    width: 120,
    height: 60,
    type: 'preprocessor',
    inputs: [
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
    connectFrom: [
      {
      /* connects to */
        component: 'input',
        to: 'i-1',
        from: 'o-1',
      },
    ],
  }],
};

export function open(req, res, u, q) {
  if (res && res.json) {
    res.json(projectInfo);
  } else {
    return projectInfo;
  }
}
