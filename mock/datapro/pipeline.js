import { getUrlParams } from '../utils';

// op status: ERROR, READY, RUNNING.
// dataset status: EMPTY, CALCULATING, CALCULATED.

const pipeline = {
  status: {
    '0136ee04-d9d8-4c90-9b5c-1f2152da564d': {
      status: 'READY',
    },
    name1: {
      status: 'CALCULATED',
    },
    '3e8e9b3d-479a-4e29-98f8-b1828dc32ee7': {
      status: 'RUNNING',
    },
    nu8: {
      status: 'CALCULATING',
    },
    '618ee91e-1562-4f7d-8f12-14dc51b727dc': {
      status: 'ERROR',
    },
    gg9: {
      status: 'EMPTY',
    },
  },
  components: [
    {
      x: 600,
      y: 200,
      id: '0136ee04-d9d8-4c90-9b5c-1f2152da564d',
      name: '文件读取',
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
      x: 800,
      y: 200,
      id: 'name1',
      name: '输入数据集',
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
      x: 1000,
      y: 200,
      id: '3e8e9b3d-479a-4e29-98f8-b1828dc32ee7',
      name: '条件过滤',
      code: 'FilterTransformer',
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
      x: 1200,
      y: 200,
      id: 'nu8',
      name: '过滤后数据集',
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
      x: 1400,
      y: 200,
      id: '618ee91e-1562-4f7d-8f12-14dc51b727dc',
      name: '数据转换',
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
      x: 1600,
      y: 200,
      id: 'gg9',
      name: '转换后数据集',
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
  const datasets = pipeline.components.filter(i => i.type === 'Dataset').map(i => i.name);
  res.json(datasets);
}

export function addOperator(req, res) {
  const { body } = req;
  const { code, input: oinput, output, name } = body;
  const input = oinput || [];
  const pos = pipeline.components
    .filter(i => i.type === 'Dataset' && input.includes(i.name))
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
    id: `Dataset-${new Date().getTime()}`,
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
    code: arr[0],
    name: arr[0] === 'PrepareTransformer' ? '数据转换' : '名称',
    configs: {
      format: {
        ignoreFirstLine: true,
        fieldDelimiter: ',',
      },
    },
    errors: {
      'format.ignoreFirstLine': '无需选中',
    },
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

export function updateOperator(req, res) {
  // update the connection.

  const { body } = req;
  const { code, input: oinput, output, name, id } = body;
  const input = oinput || [];
  const component = pipeline.components.filter(i => i.id === id)[0];
  component.name = name;
  // get output.
  component.outputs.forEach((v, i) => {
    // eslint-disable-next-line
    v.name = output[i].name;
  });
  // update input.
  component.connectFrom = input.map((v, i) => ({ component: v, from: 'o1', to: `i${i + 1}` }));
  pipeline.components = pipeline.components.map(i => (i.id === id ? component : i)); // eslint-disable-line
  const done = {
    success: true,
    message: '修改成功',
  };
  res.json(done);
}

export function runOperator(req, res) {
  const { body } = req;
  res.json({
    success: true,
    message: '提交运行中',
  });
}

export function inspectData(req, res, u, b) {
  const response = {
    schema: [
      { name: 'a1', type: 'String', nullable: false },
      { name: 'a2', type: 'String', nullable: false },
      { name: 'a3', type: 'String', nullable: false },
      { name: 'a4', type: 'String', nullable: false },
      { name: 'a5', type: 'String', nullable: false },
      { name: 'a6', type: 'String', nullable: false },
      { name: 'a7', type: 'String', nullable: false },
      { name: 'a8', type: 'String', nullable: false },
      { name: 'a9', type: 'String', nullable: false },
      { name: 'a10', type: 'String', nullable: false },
      { name: 'a11', type: 'String', nullable: false },
      { name: 'a12', type: 'String', nullable: false },
    ],
    data: [
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
      {
        a1: 'v1',
        a2: 'v2',
        a3: 'v3',
        a4: 'v4',
        a5: 'v1',
        a6: 'v2',
        a7: 'v3',
        a8: 'v4',
        a9: 'v1',
        a10: 'v2',
        a11: 'v3',
        a12: 'v4',
      },
    ],
  };
  const result = {
    success: true,
    message: 'ok',
    data: response,
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  'GET /api/datapro/projects/pipeline/get': getPipeline,
  'GET /api/datapro/projects/pipeline/datasets': getAllDatasets,
  'GET /api/datapro/projects/pipeline/op/config': getOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/config': updateOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/add': addOperator,
  'POST /api/datapro/projects/pipeline/op/update': updateOperator,
  'POST /api/datapro/projects/pipeline/op/delete': deleteOperator,
  'GET /api/datapro/projects/pipeline/op/get': getPipelineOperator,
  'POST /api/datapro/projects/pipeline/op/run': runOperator,
  'POST /api/datapro/projects/pipeline/op/inspect': inspectData,
};
