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
    createdAt: new Date(`2018-01-${Math.floor(i / 3) + 1}`),
    updatedAt: new Date(`2018-02-${Math.floor(i / 3) + 1}`),
    labels: allLabels,
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

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
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
  const result = {
    list: returnDataSource,
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
  const { method, id, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      projectListDataSource = projectListDataSource.filter(item => item.id !== id);
      break;
    case 'post':
      const i = gen();
      projectListDataSource.unshift({
        name: `项目名称 ${i}`,
        id: i,
        key: i,
        description,
        createdAt: new Date(`2018-01-${Math.floor(i / 2) + 1}`),
        updatedAt: new Date(`2018-02-${Math.floor(i / 2) + 1}`),
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
