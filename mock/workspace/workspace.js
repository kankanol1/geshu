
import { getUrlParams } from '../utils';

const projectInfo = {
  name: 'Project-name',
  components: [{
    id: 'input',
    name: 'txt输入',
    code: 'csv-source',
    x: 150,
    y: 100,
    width: 120,
    height: 120,
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
    height: 120,
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
  // settings info.
  settings: {
    input: {
      diy: {
        value: '预设值',
      },
    },
  },
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
          default: [
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
