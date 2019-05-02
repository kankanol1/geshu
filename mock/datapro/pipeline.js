import { getUrlParams, fillArray } from '../utils';

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
    'PrepareTransformer-14dc51b727dc': {
      status: 'ERROR',
    },
    gg9: {
      status: 'EMPTY',
    },
    'Dataset-1544977506208': {
      status: 'CALCULATED_ERROR',
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
      id: 'PrepareTransformer-14dc51b727dc',
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
          component: 'PrepareTransformer-14dc51b727dc',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 600,
      y: 400,
      id: 'FileDataSource-1544977506208',
      name: '文件源',
      code: 'FileDataSource',
      type: 'DataSource',
      inputs: [],
      outputs: [
        {
          id: 'o1',
          type: 'Dataset',
        },
      ],
      connectFrom: [],
    },
    {
      x: 800,
      y: 400,
      id: 'Dataset-1544977506208',
      name: 'dddd',
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
          component: 'FileDataSource-1544977506208',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1100,
      y: 400,
      id: 'FilterTransformer-1544977551420',
      name: '条件过滤',
      code: 'FilterTransformer',
      type: 'Transformer',
      inputs: [
        {
          id: 'i1',
          connects: ['Dataset'],
        },
      ],
      outputs: [
        {
          id: 'o1',
          type: 'Dataset',
        },
      ],
      connectFrom: [
        {
          component: 'Dataset-1544977506208',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1300,
      y: 400,
      id: 'Dataset-1544977551420',
      name: 'ttt',
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
          component: 'FilterTransformer-1544977551420',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 590,
      y: 600,
      id: 'DefineSchemaSource-1544977551420',
      name: '定义目标模式',
      code: 'DefineSchemaSource',
      type: 'SchemaSource',
      inputs: [],
      outputs: [
        {
          id: 'o1',
          connects: ['Schema'],
        },
      ],
      connectFrom: [],
    },
    {
      x: 830,
      y: 600,
      id: 'Schema-1554387193108',
      name: 'ds',
      code: 'Schema',
      type: 'Schema',
      inputs: [
        {
          id: 'i1',
          connects: ['SchemaSource'],
        },
      ],
      outputs: [
        {
          id: 'o1',
          connects: ['MappingOperator'],
        },
      ],
      connectFrom: [
        {
          component: 'DefineSchemaSource-1544977551420',
          from: 'o1',
          to: 'i1',
        },
      ],
    },
    {
      x: 1100,
      y: 600,
      id: 'MappingOperator-1554387495454',
      name: '目标模式匹配',
      code: 'MappingOperator',
      type: 'MappingOperator',
      inputs: [
        {
          id: 'i1',
          connects: ['Dataset'],
        },
        {
          id: 'i2',
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
          component: 'Schema-1554387193108',
          from: 'o1',
          to: 'i1',
        },
        {
          component: 'Dataset-1544977506208',
          from: 'o1',
          to: 'i2',
        },
      ],
    },
    {
      x: 1300,
      y: 600,
      id: 'Dataset-1554387495455',
      name: 'out1',
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
          component: 'MappingOperator-1554387495454',
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

let prepareOpConfig = [
  {
    type: 'SelectTransformation',
    config: {
      fields: ['a1'],
    },
  },
  {
    type: 'ConcatTransformation',
    config: {
      as: 'a1',
      by: ',',
      fields: ['ac1', 'ac2'],
    },
  },
  ...fillArray(
    {
      type: 'ConcatTransformation',
      config: {
        as: 'a1',
        by: ',',
        fields: ['ac1', 'ac2'],
      },
    },
    20
  ),
];

export function getPipeline(req, res) {
  setTimeout(() => res.json(pipeline), 2000);
}

export function getAllDatasets(req, res) {
  const datasets = pipeline.components.filter(i => i.type === 'Dataset').map(i => i.name);
  res.json(datasets);
}

export function getAllObjectiveSchemas(req, res) {
  const datasets = pipeline.components.filter(i => i.type === 'Schema').map(i => i.name);
  res.json(datasets);
}

export function addOperator(req, res) {
  const { body } = req;
  const { code, input: oinput, output: ooutput, name } = body;
  const input = oinput || [];
  const output = ooutput || [];
  const pos = pipeline.components
    .filter(i => i.type === 'Dataset' && input.includes(i.name))
    .map(i => ({ x: i.x, y: i.y }));

  // get dataset id.
  const nameToIds = {};
  pipeline.components.forEach(i => {
    nameToIds[i.name] = i.id;
  });

  const newPos = { x: 0, y: 0 };
  pos.forEach(({ x, y }) => {
    if (x > newPos.x) {
      newPos.x = x;
    }
    newPos.y += y;
  });
  newPos.x += 300;
  newPos.y /= pos.length + 1;
  const opId = `${code}-${new Date().getTime()}`;
  let type = oinput ? 'Transformer' : 'DataSource';
  if (code === 'DefineSchemaSource') {
    type = 'SchemaSource';
  } else if (code === 'MappingOperator') {
    type = 'MappingOpertor';
  }
  const newComponent = {
    ...newPos,
    id: opId,
    name,
    code,
    type,
    inputs: input ? input.map((v, i) => ({ id: `i${i + 1}`, connects: ['Dataset'] })) : [],
    outputs: output.map((v, i) => ({ id: `o${i + 1}`, type: 'Dataset' })),
    connectFrom: input.map((v, i) => ({ component: nameToIds[v], from: 'o1', to: `i${i + 1}` })),
  };
  const offset = output.length * 200;
  const baseY = newPos.y - offset / 2;
  let extraComponents = [];
  if (type === 'SchemaSource') {
    const datasets = output.map((v, i) => ({
      x: newPos.x + 200,
      y: baseY + 200 * (i + 1),
      id: `Schema-${new Date().getTime()}`,
      name: v,
      code: 'Schema',
      type: 'Schema',
      inputs: [
        {
          id: 'i1',
          connects: ['SchemaSource'],
        },
      ],
      outputs: [
        {
          id: 'o1',
          connects: ['MappingOperator'],
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
    extraComponents = datasets;
  } else {
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
    extraComponents = datasets;
  }
  pipeline.components.push(newComponent);
  extraComponents.forEach(i => pipeline.components.push(i));
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
  let configs = {
    format: {
      ignoreFirstLine: true,
      fieldDelimiter: ',',
    },
  };
  if (params.opId.includes('PrepareTransformer')) {
    configs = prepareOpConfig;
  }
  const preparing = arr[0] === 'PrepareTransformer';
  const result = {
    id: params.opId,
    type: arr[0],
    code: arr[0],
    name: preparing ? '数据转换' : `${arr[0]}名称`,
    configs,
    errors: preparing
      ? [
          {
            as: '错误',
          },
          {
            as: '错误2',
          },
        ]
      : {
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

export function inspectSchema(req, res) {
  const response = {
    schema: [
      { name: 'b1', type: 'String', nullable: false },
      { name: 'b2', type: 'String', nullable: false },
      { name: 'b3', type: 'String', nullable: true },
      { name: 'b4', type: 'Integer', nullable: false },
    ],
  };
  res.json({
    success: true,
    message: '返回',
    data: response,
  });
}

export function inspectData(req, res) {
  const response = {
    schema: [
      { name: '___id___', type: 'Integer', nullable: true },
      { name: '___message___', type: 'String', nullable: true },
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
    types: [
      { name: '___id___', type: null },
      { name: '___message__', type: null },
      { name: 'a1', type: null },
      { name: 'a2', type: null },
      { name: 'a3', type: 'NAME' },
      { name: 'a4', type: 'EMAIL' },
      { name: 'a5', type: 'ADDRESS' },
      { name: 'a6', type: null },
      { name: 'a7', type: null },
      { name: 'a8', type: null },
      { name: 'a9', type: 'ADDRESS' },
      { name: 'a10', type: 'ADDRESS' },
      { name: 'a11', type: 'NAME' },
      { name: 'a12', type: 'EMAIL' },
    ],
    data: fillArray(
      {
        ___id___: 'id',
        ___message___: '错误详细信息java.runtime.NullPointerException,shoudlsadsa',
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
      100
    ),
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

export function getOperatorObjectiveSchema(req, res) {
  const fakeSchema = [
    { name: 'b1', type: 'String', nullable: false },
    { name: 'b2', type: 'String', nullable: false },
    { name: 'b3', type: 'String', nullable: false },
    { name: 'b4', type: 'Integer', nullable: false },
  ];
  res.json({
    success: true,
    message: 'success',
    data: {
      i1: fakeSchema,
    },
  });
}

export function getOperatorSchema(req, res) {
  const fakeSchema = [
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
  ];
  res.json({
    success: true,
    message: 'success',
    data: {
      i1: fakeSchema,
      i2: fakeSchema,
    },
  });
}

export function invalidOperator(req, res) {
  const { body } = req;
  const { projectId, id } = body;
  pipeline.status[id] = 'EMPTY';
  console.log('emptyed', id); // eslint-disable-line
  res.json({
    success: true,
    message: 'success',
  });
}

export function getTransformationSchema(req, res) {
  const fakeSchema = [
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
  ];
  res.json({
    success: true,
    message: 'success',
    data: fakeSchema,
  });
}

export function addTransformation(req, res) {
  const { body } = req;
  const { config, id, projectId } = body;
  const { config: nc, type } = config;
  prepareOpConfig.push({ type, config: nc });
  // always append.
  res.json({
    success: true,
    message: 'done',
  });
}

export function deleteTransformation(req, res) {
  const { body } = req;
  const { projectId, id, index } = body;
  prepareOpConfig = prepareOpConfig.filter((v, i) => i < index);
  res.json({
    success: true,
    message: 'done',
  });
}

export function previewPreOp(req, res) {
  const params = getUrlParams(req.url);
  const { page, size } = params;
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      a1: `v1-p-${page}-i-${i}`,
      a2: `v2-p-${page}-i-${i}`,
      a3: `v3-p-${page}-i-${i}`,
      a4: `v4-p-${page}-i-${i}`,
      a5: `v5-p-${page}-i-${i}`,
      a6: `v6-p-${page}-i-${i}`,
      a7: `v7-p-${page}-i-${i}`,
      a8: `v8-p-${page}-i-${i}`,
      a9: `v9-p-${page}-i-${i}`,
      a10: `v10-p-${page}-i-${i}`,
      a11: `v11-p-${page}-i-${i}`,
      a12: `v12-p-${page}-i-${i}`,
    });
  }
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
    data,
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

export function getPublishMeta(req, res) {
  const result = {
    inputs: [{ name: 'd1', id: 'xxx1' }, { name: 'd2', id: 'xxxx1' }],
    outputs: [{ name: 'output' }],
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function publishPipeline(req, res) {
  const result = {
    success: true,
    message: 'ok',
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
  'GET /api/datapro/projects/pipeline/objectiveschemas': getAllObjectiveSchemas,
  // 'GET /api/datapro/projects/pipeline/op/config': getOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/config': updateOperatorConfig,
  'POST /api/datapro/projects/pipeline/op/add': addOperator,
  'POST /api/datapro/projects/pipeline/op/update': updateOperator,
  'POST /api/datapro/projects/pipeline/op/delete': deleteOperator,
  'GET /api/datapro/projects/pipeline/op/get': getPipelineOperator,
  'POST /api/datapro/projects/pipeline/op/run': runOperator,
  'POST /api/datapro/projects/pipeline/op/inspect': inspectData,
  'POST /api/datapro/projects/pipeline/op/inspectschema': inspectSchema,
  'POST /api/datapro/projects/pipeline/op/schema': getOperatorSchema,
  'POST /api/datapro/projects/pipeline/op/objectiveschema': getOperatorObjectiveSchema,
  'POST /api/datapro/projects/pipeline/op/typeupdate': { success: true, message: 'ok' },
  'POST /api/datapro/projects/pipeline/op/invalid': invalidOperator,
  // get schema for transformation in prepare op.
  'POST /api/datapro/projects/pipeline/op/trans/schema': getTransformationSchema,
  'POST /api/datapro/projects/pipeline/op/trans/add': addTransformation,
  'POST /api/datapro/projects/pipeline/op/trans/delete': deleteTransformation,
  'GET /api/datapro/projects/pipeline/op/trans/preview': previewPreOp,
  'GET /api/datapro/projects/pipeline/publish': getPublishMeta,
  'POST /api/datapro/projects/pipeline/publish': publishPipeline,
};
