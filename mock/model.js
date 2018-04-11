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

export default {
  getModels,
  deleteModels,
  updateModel,
  addModel,
};

