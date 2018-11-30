import { getUrlParams } from '../utils';

const pipeline = {
  components: [
    {
      x: 600,
      y: 200,
      id: '0136ee04-d9d8-4c90-9b5c-1f2152da564d',
      name: 'FileDataSource1',
      code: 'FileDataSource',
      type: 'DataSource',
      inputs: [],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [],
    },
    {
      x: 900,
      y: 200,
      id: 'name1',
      name: 'name1',
      code: 'Dataset',
      type: 'Dataset',
      inputs: [
        {
          id: 'i1',
        },
      ],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [
        {
          component: '0136ee04-d9d8-4c90-9b5c-1f2152da564d',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1200,
      y: 200,
      id: '3e8e9b3d-479a-4e29-98f8-b1828dc32ee7',
      name: 'trans1',
      code: 'AddLiteralColumnTransformer',
      type: 'Transformer',
      inputs: [
        {
          id: 'i1',
        },
      ],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [
        {
          component: 'name1',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1500,
      y: 200,
      id: 'nu8',
      name: 'nu8',
      code: 'Dataset',
      type: 'Dataset',
      inputs: [
        {
          id: 'i1',
        },
      ],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [
        {
          component: '3e8e9b3d-479a-4e29-98f8-b1828dc32ee7',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1800,
      y: 200,
      id: '618ee91e-1562-4f7d-8f12-14dc51b727dc',
      name: 'Trans',
      code: 'AddLiteralColumnTransformer',
      type: 'Transformer',
      inputs: [
        {
          id: 'i1',
        },
      ],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [
        {
          component: 'nu8',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 2100,
      y: 200,
      id: 'gg9',
      name: 'gg9',
      code: 'Dataset',
      type: 'Dataset',
      inputs: [
        {
          id: 'i1',
        },
      ],
      outputs: [
        {
          id: 'o1',
        },
      ],
      connectFrom: [
        {
          component: '618ee91e-1562-4f7d-8f12-14dc51b727dc',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
  ],
  offset: {
    x: 0,
    y: 0,
  },
  scale: 0.8,
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
  const { code, input: oinput, output, name } = body;
  const input = oinput || [];
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
  const opId = `${code}-${new Date().getTime()}`;
  const newComponent = {
    ...newPos,
    id: opId,
    name,
    code,
    type: oinput ? 'Transformer' : 'DataSource',
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
    data: opId,
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

export function getPipelineOperator(req, res) {
  const params = getUrlParams(req.url);
  const arr = params.opId.split('-');
  const result = {
    id: params.opId,
    type: arr[0],
    name: '名称',
  };
  res.json(result);
}

export function getOperatorConfig(req, res) {
  const params = getUrlParams(req.url);
  const result = {
    config: {},
    id: params.id,
    projectId: params.projectId,
  };
  res.json(result);
}

export function updateOperatorConfig(req, res) {
  const result = {
    success: true,
    message: '更新成功',
  };
  res.json(result);
}

export default {
  'GET /api/datapro/projects/pipeline/get': getPipeline,
  'GET /api/datapro/projects/pipeline/getop': getPipelineOperator,
  'GET /api/datapro/projects/pipeline/datasets': getAllDatasets,
  'GET /api/datapro/projects/pipeline/op/config': getOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/config': updateOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/add': addOperator,
  'POST /api/datapro/projects/pipeline/op/delete': deleteOperator,
  'POST /api/datapro/projects/pipeline/op/addsource': addOperator,
};
