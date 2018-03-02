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
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > 0);
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
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[0]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[0]) {
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

export function postProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, ids, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      projectListDataSource = projectListDataSource.filter(item => !ids.includes(item.id));
      break;
    case 'post':
      const i = gen();
      projectListDataSource.unshift({
        name: `项目名称 ${i}`,
        id: i,
        key: i,
        description,
        createdAt: moment(`2018-01-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
        updatedAt: moment(`2018-02-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
        labels: allLabels,
      });
      break;
    default:
      break;
  }

  const result = {
    list: projectListDataSource,
    pagination: {
      total: projectListDataSource.length,
    },
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

export default{
  getProject,
  postProject,
  getProjectLabels,
};
