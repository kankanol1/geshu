import moment from 'moment';
import { getUrlParams } from './utils';

/**
 * proejct related mock.
 */

// mock project list

const allLabels = [
  '测试',
  '开发中',
  '模型项目',
  'ETL项目',
  '数据上线项目',
];

const generatedLabels = [
  [
    '测试',
    '模型项目',
  ],
  [
    '开发中',
    '模型项目',
  ],
  [
    '测试',
    '数据上线项目',
  ],
  [
    '数据上线项目',
  ],
  [
    '开发中',
    'ETL项目',
  ],
];

const graphStatus = ['new', 'schema-created', 'schema-executed', 'data-mapped', 'data-loading', 'data-loaded'];

let projectListDataSource = [];

let num = 1000;
const gen = () => {
  return num++;
};

for (let i = 0; i < 66; i += 1) {
  projectListDataSource.push({
    name: `项目名称 ${i}`,
    key: i,
    id: i,
    description: '项目描述',
    createdAt: moment(`2018-01-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
    labels: generatedLabels[i % 5],
    status: graphStatus[i % graphStatus.length],
  });
}

export function getProject(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...projectListDataSource];

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

  if (params.labels) {
    const labels = params.labels.split(',');
    dataSource = dataSource.filter((data) => {
      let result = true;
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (!data.labels.includes(label)) {
          result = false;
        }
      }
      return result;
    });
  }

  if (params.updatedAt) {
    const updatedAt = params.updatedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[1]) {
        return true;
      }
      return false;
    });
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
      updatedAt: item.updatedAt.format('YYYY-MM-DD HH:mm'),
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

export function createProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, description, labels } = body;

  const i = gen();
  projectListDataSource.unshift({
    name,
    id: i,
    key: i,
    description,
    createdAt: moment(`2018-01-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    labels: labels ? labels.split(',') : [],
    status: 'new',
  });

  const result = {
    success: true,
    message: '添加成功',
    data: i,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  projectListDataSource = projectListDataSource.filter(item => !ids.includes(item.id));

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

export function updateProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { id, name, description, labels } = body;

  projectListDataSource = projectListDataSource.map((item) => {
    if (item.id === id) {
      return { ...item, name, description, labels: labels ? labels.split(',') : [] };
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

export function getProjectLabels(req, res) {
  const result = {
    list: allLabels,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getRecentProjects(req, res) {
  const result = [
  ];

  for (let i = 0; i < 10; i++) {
    result.push({
      name: `项目名称 ${i}`,
      key: i,
      id: i,
      description: '项目描述',
      createdAt: moment(`2018-01-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
      updatedAt: moment(`2018-02-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
      labels: generatedLabels[i % 5],
    });
  }
  result.push({
    name: '测试一个很长的项目名称在前端显示时可能一行会放不开看一下最终效果是否可以接受',
    key: 100,
    id: 100,
    description: '项目描述',
    createdAt: moment('2018-03-01', 'YYYY-MM-DD'),
    updatedAt: moment('2018-03-02', 'YYYY-MM-DD'),
    labels: generatedLabels[100 % 5],
  });

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getProject,
  updateProject,
  createProject,
  deleteProject,
  getProjectLabels,
};
