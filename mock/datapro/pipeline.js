const pipeline = {
  components: [
    {
      x: 755,
      y: 414,
      id: '分词15315274966',
      name: '分词',
      code: 'TokenizerStage',
      type: 'OP',
      inputs: [
        {
          id: 'i1',
          label: 'all',
          connects: ['Model', 'Dataset'],
        },
      ],
      outputs: [
        {
          hint: 'Model',
          id: 'o1',
          label: 'model',
          type: 'Model',
        },
      ],
      connectFrom: [],
    },
    {
      x: 761.5,
      y: 224.5,
      id: '分词1531527496608',
      name: '分词',
      code: 'TokenizerStage',
      type: 'OP',
      inputs: [
        {
          hint: 'all',
          id: 'i1',
          label: 'all',
          connects: ['Model', 'Dataset'],
        },
      ],
      outputs: [
        {
          hint: 'Model',
          id: 'o1',
          label: 'model',
          type: 'Model',
        },
      ],
      connectFrom: [
        {
          component: 'dataset1',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 429,
      y: 196,
      id: '文件读取1531527496607',
      name: '文件读取',
      code: 'FileDataSource',
      type: 'DataSource',
      inputs: [],
      outputs: [
        {
          hint: 'Dataset',
          id: 'o1',
          label: 'data',
          type: 'Dataset',
        },
      ],
      connectFrom: [],
    },
    {
      x: 629,
      y: 196,
      id: 'dataset1',
      name: 'Dataset',
      code: 'Dataset',
      type: 'Dataset',
      inputs: [
        {
          hint: 'dataset',
          id: 'i1',
          label: 'data',
          type: 'dataset',
        },
      ],
      outputs: [
        {
          hint: 'dataset',
          id: 'o1',
          label: 'data',
          type: 'dataset',
        },
      ],
      connectFrom: [
        {
          component: '文件读取1531527496607',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 674,
      y: 303,
      id: 'Join1532467809093',
      name: 'Join',
      code: 'JoinTransformer',
      type: 'OP',
      inputs: [
        {
          hint: 'left',
          id: 'i1',
          label: 'left',
          connects: ['Dataset'],
        },
        {
          hint: 'right',
          id: 'i2',
          label: 'right',
          connects: ['Dataset'],
        },
      ],
      outputs: [
        {
          hint: 'Dataset',
          id: 'o1',
          label: 'data',
          type: 'Dataset',
        },
      ],
      connectFrom: [
        {
          component: 'dataset1',
          from: 'o1',
          to: 'i1',
        },
        {
          component: 'dataset1',
          from: 'o1',
          to: 'i2',
        },
      ],
    },
  ],
};

export function getPipeline(req, res) {
  res.json(pipeline);
}

export function getAllDatasets(req, res) {
  const datasets = pipeline.components.filter(i => i.type === 'Dataset').map(i => i.id);
  res.json(datasets);
}

export function addOperator(req, res) {
  const { body } = req;
  const { type, input, output } = body;
  const pos = pipeline.components
    .filter(i => i.type === 'Dataset' && input.includes(i.id))
    .map(i => ({ x: i.x, y: i.y }));

  const newPos = { x: 0, y: 0 };
  pos.forEach(({ x, y }) => {
    if (x > newPos.x) {
      newPos.x = x;
    }
    newPos.y += y;
  });
  newPos.x += 300;
  newPos.y /= pos.length;
  const opId = `op${new Date().getTime()}`;
  const newComponent = {
    ...newPos,
    id: opId,
    name: '新增组件',
    code: type,
    inputs: input ? input.map((v, i) => ({ id: `i${i + 1}`, connects: ['Dataset'] })) : [],
    outputs: output.map((v, i) => ({ id: `o${i + 1}`, type: 'Dataset' })),
    connectFrom: input.map((v, i) => ({ component: v, from: 'o1', to: `i${i + 1}` })),
  };
  const offset = output.length * 200;
  const baseY = newPos.y - offset / 2;
  const datasets = output.map((v, i) => ({
    x: newPos.x + 200,
    y: baseY + 200 * (i + 1),
    id: v,
    name: v,
    code: 'Dataset',
    type: 'Dataset',
    inputs: [
      {
        id: 'i1',
        connects: ['Dataset'],
      },
    ],
    outputs: [
      {
        id: 'o1',
        connects: ['Dataset'],
      },
    ],
    connectFrom: [
      {
        component: opId,
        from: `o${i + 1}`,
        to: 'i1',
      },
    ],
  }));
  pipeline.components.push(newComponent);
  datasets.forEach(i => pipeline.components.push(i));
  const done = {
    success: true,
    message: '添加成功',
    delta: [newComponent, ...datasets],
  };
  res.json(done);
}

export function deleteOperator(req, res) {
  const { body } = req;
  const { id } = body;
  const deleteIds = [];
  deleteIds.push(id);
  // get all following ids.
  let added = true;
  while (added) {
    added = false;
    // eslint-disable-next-line
    pipeline.components.forEach(c => {
      c.connectFrom.forEach(f => {
        if (deleteIds.includes(f.component) && !deleteIds.includes(c.id)) {
          deleteIds.push(c.id);
          added = true;
        }
      });
    });
  }
  pipeline.components = pipeline.components.filter(i => !deleteIds.includes(i.id));
  const done = {
    success: true,
    message: '删除成功',
  };
  res.json(done);
}

export default {
  'GET /api/datapro/projects/pipeline/get': getPipeline,
  'GET /api/datapro/projects/pipeline/datasets': getAllDatasets,
  'POST /api/datapro/projects/pipeline/op/add': addOperator,
  'POST /api/datapro/projects/pipeline/op/delete': deleteOperator,
  'POST /api/datapro/projects/pipeline/op/addsource': addOperator,
};
