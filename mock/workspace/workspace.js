
import { getUrlParams } from '../utils';

const projectInfo = {
  validation: {
    分词15315274966: {
      errors: [
        '反正哪里不对，出错示例',
      ],
    },
    分词1531527496608: {
      warns: [
        '哪里不太好，警告',
      ],
    },
  },
  schema: {
    文件读取1531527496607: {
      o1: [
        {
          nullable: true,
          name: 'id',
          type: '"string"',
        },
        {
          nullable: true,
          name: 'text',
          type: '"string"',
        },
        {
          nullable: true,
          name: 'label',
          type: '"integer"',
        },
      ],
    },
  },
  settings: {
    分词1531527496608: {
      columnAndName: {
        column: 'text',
        name: 'words',
      },
    },
    文件读取1531527496607: {
      sourceConf: {
        path: {
          value: 'hdfs://52.83.147.191:9000/projectx/store-public/yo/food-test.csv',
        },
        format: 'csv',
        header: {
          value: true,
        },
        definedSchema: {
          schema: [
            {
              metadata: {},
              nullable: true,
              name: 'id',
              type: '"string"',
            },
            {
              metadata: {},
              nullable: true,
              name: 'text',
              type: '"string"',
            },
            {
              metadata: {},
              nullable: true,
              name: 'label',
              type: '"integer"',
            },
          ],
          on: true,
        },
      },
    },
  },
  createdAt: '2018-07-13 20:17:16',
  components: [
    {
      x: 455,
      y: 414,
      id: '分词15315274966',
      name: '分词',
      code: 'TokenizerStage',
      type: 'Stage',
      inputs: [
        {
          hint: 'all',
          x: 3,
          y: 0.5,
          id: 'i1',
          label: 'all',
          connects: [
            'Model',
            'Dataset',
          ],
        },
      ],
      outputs: [
        {
          hint: 'Model',
          x: 1,
          y: 0.5,
          id: 'o1',
          label: 'model',
          type: 'Model',
        },
      ],
      connectFrom: [],
    },
    {
      x: 584,
      y: 232,
      id: '分词1531527496608',
      name: '分词',
      code: 'TokenizerStage',
      type: 'Stage',
      inputs: [
        {
          hint: 'all',
          x: 3,
          y: 0.5,
          id: 'i1',
          label: 'all',
          connects: [
            'Model',
            'Dataset',
          ],
        },
      ],
      outputs: [
        {
          hint: 'Model',
          x: 1,
          y: 0.5,
          id: 'o1',
          label: 'model',
          type: 'Model',
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
      x: 129,
      y: 196,
      id: '文件读取1531527496607',
      name: '文件读取',
      code: 'FileDataSource',
      type: 'DataSource',
      inputs: [],
      outputs: [
        {
          hint: 'Dataset',
          x: 1,
          y: 0.5,
          id: 'o1',
          label: 'data',
          type: 'Dataset',
        },
      ],
      connectFrom: [],
    },
    {
      x: 374,
      y: 303,
      id: 'Join1532467809093',
      name: 'Join',
      code: 'JoinTransformer',
      type: 'Transformer',
      inputs: [
        {
          hint: 'left',
          x: 3,
          y: 0.3333333333333333,
          id: 'i1',
          label: 'left',
          connects: [
            'Dataset',
          ],
        },
        {
          hint: 'right',
          x: 3,
          y: 0.6666666666666666,
          id: 'i2',
          label: 'right',
          connects: [
            'Dataset',
          ],
        },
      ],
      outputs: [
        {
          hint: 'Dataset',
          x: 1,
          y: 0.5,
          id: 'o1',
          label: 'data',
          type: 'Dataset',
        },
      ],
      connectFrom: [
        {
          component: '文件读取1531527496607',
          from: 'o1',
          to: 'i1',
        },
        {
          component: '文件读取1531527496607',
          from: 'o1',
          to: 'i2',
        },
      ],
    },
  ],
  name: '项目名称',
  description: 'ww',
  id: 14,
  labels: [],
  updatedAt: '2018-07-13 20:19:20',
};

export function open(req, res, u, q) {
  if (res && res.json) {
    res.json(projectInfo);
  } else {
    return projectInfo;
  }
}

export function submit(req, res, u, q) {
  const result = {
    success: true,
    message: '提交成功',
    jobId: 'xxxx-xxxx-xxxx-xxxx',
  };

  setTimeout(() => {
    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  }, 2000);
}

export function validate(req, res, u, q) {
  const result = {
    success: true,
    message: '验证通过',
  };

  setTimeout(() => {
    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  }, 2000);
}

let schema = {};

export function generateSchema(components) {
  schema = {};
  components.forEach(
    (item) => {
      if (item.name.indexOf('文件读取') > -1) {
        schema[item.id] = {
          o1: [
            {
              name: 'key',
              type: '"string"',
              nullable: false,
            },
            {
              name: 'value',
              type: '"string"',
              nullable: true,
            },
          ],
        };
      }
    }
  );
}

export function save(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }


  const body = (b && b.body) || req.body;

  const { components } = body;
  generateSchema(components);

  // eslint-disable-next-line
  console.log('save: project id', req.params.projectId);
  // console.log('saved', body);


  const result = {
    success: true,
    message: '保存成功',
    schema,
    validation: {},
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveSettings(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }


  const body = (b && b.body) || req.body;

  // eslint-disable-next-line
  console.log('save: project id, component id', req.params.projectId, req.params.componentId);
  // console.log('saved', body);


  const result = {
    success: true,
    message: '保存成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
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
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
      { a1: 'v1', a2: 'v2', a3: 'v3', a4: 'v4', a5: 'v1', a6: 'v2', a7: 'v3', a8: 'v4', a9: 'v1', a10: 'v2', a11: 'v3', a12: 'v4' },
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
