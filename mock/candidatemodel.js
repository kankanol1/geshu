import moment from 'moment';
import { getUrlParams } from './utils';
import { addModel } from './model';

let models = [
  { id: 'gen-1',
    name: 'c模型1',
    description: '模型描述',
    projectName: 'project1',
    projectId: '0',
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
  },
];

for (let i = 0; i < 66; i += 1) {
  models.push({
    id: `gen${i}`,
    name: `c模型${i}`,
    description: `模型描述${i}`,
    projectName: 'project1',
    projectId: '0',
    createdAt: moment('2018-03-02', 'YYYY-MM-DD'),
  });
}

export function getCandidateModels(req, res, u) {
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

  if (params.projectId) {
    dataSource = dataSource.filter(data => data.projectId === params.projectId);
  }

  if (params.projectName) {
    dataSource = dataSource.filter(data => data.projectName.indexOf(params.projectName) >= 0);
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

export function deleteCandidateModels(req, res, u, b) {
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

export function updateCandidateModel(req, res, u, b) {
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

export function publishCandidateModels(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  models.forEach(
    (model) => {
      if (ids.includes(model.id)) {
        addModel({ name: model.name, description: model.description });
      }
    }
  );

  models = models.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '发布成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getCandidateModels,
  deleteCandidateModels,
  updateCandidateModel,
  publishCandidateModels,
};

