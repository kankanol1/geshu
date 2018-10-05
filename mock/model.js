import moment from 'moment';
import { getUrlParams } from './utils';

let num = 1000;
const gen = () => {
  return num++;
};

let models = [
  { id: 'gen-1',
    name: '模型1',
    description: '模型描述',
    addedBy: 'admin',
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
    addedAt: moment('2018-03-03', 'YYYY-MM-DD'),
    updatedAt: moment('2018-02-0', 'YYYY-MM-DD'),
    isOnline: false,
  },
];

for (let i = 0; i < 66; i += 1) {
  models.push({
    id: `gen${i}`,
    name: `模型${i}`,
    addedBy: i % 5 === 0 ? `user${i}` : (i % 5 === 1 ? 'admin' : 'user'),
    description: `模型描述${i}`,
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
    addedAt: moment('2018-03-03', 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 20) + 1}`, 'YYYY-MM-DD'),
    isOnline: i % 5 === 0,
  });
}

export function getModels(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...models];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) >= 0);
  }

  if (params.addedBy) {
    dataSource = dataSource.filter(data => data.addedBy.indexOf(params.addedBy) >= 0);
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[1]) {
        return true;
      }
      return false;
    });
  }
  if (params.addedAt) {
    const addedAt = params.addedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.addedAt >= addedAt[0] && data.addedAt <= addedAt[1]) {
        return true;
      }
      return false;
    });
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage; // eslint-disable-line
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = dataSource.slice(startNum, startNum + pageSize);

  const formatedDataSource = returnDataSource.map((item) => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      addedAt: item.addedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteModels(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  models = models.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function updateModel(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { id, name, description } = body;

  models = models.map((item) => {
    if (item.id === id) {
      return { ...item, name, description };
    }
    return item;
  });

  const result = {
    success: true,
    message: '修改成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function addModel({ id, name, description }) {
  const i = gen();
  models.unshift({
    name,
    id: i,
    description,
    addedBy: `user${i}`,
    createdAt: moment(`2018-01-0${Math.floor(i / 20) + 1}`, 'YYYY-MM-DD'),
    addedAt: moment(`2018-02-0${Math.floor(i / 20) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 20) + 1}`, 'YYYY-MM-DD'),
  });
}

export function getModelInfo(req, res, u, b) {
  const response = {
    fileName: '4_app-20180712160433-0095_模型存储1531405753901',
    addedAt: null,
    inputSchema: '{"type":"struct","fields":[{"name":"age","type":"integer","nullable":true,"metadata":{}},{"name":"workclass","type":"string","nullable":true,"metadata":{}},{"name":"education-num","type":"integer","nullable":true,"metadata":{}},{"name":"marital-status","type":"string","nullable":true,"metadata":{}},{"name":"occupation","type":"string","nullable":true,"metadata":{}},{"name":"relationship","type":"string","nullable":true,"metadata":{}},{"name":"race","type":"string","nullable":true,"metadata":{}},{"name":"sex","type":"string","nullable":true,"metadata":{}},{"name":"hours-per-week","type":"integer","nullable":true,"metadata":{}},{"name":"native-country","type":"string","nullable":true,"metadata":{}},{"name":"result","type":"string","nullable":true,"metadata":{}}]}',
    publishedAt: null,
    addedBy: 0,
    offlinedBy: 1,
    offlinedAt: null,
    onlinedBy: 0,
    createdAt: '2018-07-12 16:05:41',
    createdBy: 1,
    sinkId: '模型存储1531405753901',
    name: '4',
    online: true,
    id: 27,
    state: false,
    onlinedAt: '2018-07-12 15:17:04',
    projectId: 4,
    updatedAt: '2018-07-12 16:05:41',
    servingSchema: [
      {
        nullable: true,
        name: '年龄',
        type: 'double',
      },
      {
        nullable: true,
        name: '犯罪次数',
        type: 'double',
      },
      {
        nullable: true,
        name: '学历',
        type: 'string',
      },
      {
        nullable: true,
        name: '是否在逃',
        type: 'double',
      },
    ],
  };
  if (res && res.json) {
    res.json(response);
  } else {
    return response;
  }
}

export function getModelResult(req, res, u, b) {
  const response = {
    message: '执行成功',
    success: true,
    data: {
      schema: [
        {
          name: '年龄',
          type: 'double',
          nullable: true,
        },
        {
          name: '犯罪次数',
          type: 'double',
          nullable: true,
        },
        {
          name: '学历',
          type: 'string',
          nullable: true,
        },
        {
          name: '是否在逃',
          type: 'double',
          nullable: true,
        },
        {
          name: '学历_idx',
          type: 'double',
          nullable: false,
        },
        {
          name: '学历_oneHot',
          type: 'double',
          nullable: true,
        },
        {
          name: 'features_none',
          type: 'double',
          nullable: true,
        },
        {
          name: 'features_standard_tmp',
          type: 'double',
          nullable: true,
        },
        {
          name: 'features_standard',
          type: 'double',
          nullable: true,
        },
        {
          name: 'features',
          type: 'double',
          nullable: true,
        },
        {
          name: 'rawPrediction',
          type: 'double',
          nullable: true,
        },
        {
          name: 'probability',
          type: 'double',
          nullable: true,
        },
        {
          name: 'prediction',
          type: 'double',
          nullable: false,
        },
      ],
      data: [
        {
          学历_idx: 19,
          probability: '[0.8939003276284048, 0.1060996723715952]',
          犯罪次数: 0,
          features_standard_tmp: '[0.0]',
          是否在逃: 0,
          features_standard: '[0.0]',
          学历: '',
          features: '[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]',
          rawPrediction: '[2.1312153209151674, -2.1312153209151674]',
          prediction: 0,
          年龄: 0,
          学历_oneHot: '[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]',
          features_none: '[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]',
        },
      ],
    },
  };
  if (res && res.json) {
    res.json(response);
  } else {
    return response;
  }
}

export default {
  getModels,
  deleteModels,
  updateModel,
  addModel,
  getModelInfo,
  getModelResult,
};
