import moment from 'moment';
import { getUrlParams } from './utils';

/**
 * proejct related mock.
 */

// mock project list

let databaseListDataSource = [];

let num = 1000;
const gen = () => {
  return num++;
};

for (let i = 0; i < 66; i += 1) {
  databaseListDataSource.push({
    name: `数据库 ${i}`,
    key: i,
    id: i,
    description: '描述',
    createdBy: 'admin',
    createdAt: moment(`2018-01-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
    schema: [],
    isPublic: true,
    tableName: `数据表 ${i}`,
  });
}

export function getDatabase(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...databaseListDataSource];

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

  if (params.tableName) {
    dataSource = dataSource.filter(data => data.tableName.indexOf(params.tableName) >= 0);
  }

  if (params.id) {
    dataSource = dataSource.filter((data) => {
      if (params.id === data.id) {
        return true;
      } else {
        return false;
      }
    });
  }
  if (params.isPublic) {
    dataSource = dataSource.filter((data) => {
      if (params.isPublic === false) {
        return false;
      } else {
        return true;
      }
    });
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

export function createDatabase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, description, labels, redirect } = body;

  const i = gen();
  databaseListDataSource.unshift({
    name,
    id: i,
    key: i,
    description,
    createdAt: moment(`2018-01-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    createdBy: 'admin',
    schema: [],
    isPublic: true,
    tableName: `数据表 ${i}`,
  });

  const result = {
    success: true,
    message: redirect ? i : '添加成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteDatabase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  databaseListDataSource = databaseListDataSource.filter(item => !ids.includes(item.id));

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

export function makePublicDatabase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  databaseListDataSource.forEach(
    (item) => {
      if (ids.includes(item.id)) {
        item.isPublic = true; //eslint-disable-line
      }
    }
  );
  const result = {
    success: true,
    message: '已公开',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function makePrivateDatabase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  databaseListDataSource.forEach(
    (item) => {
      if (ids.includes(item.id)) {
        item.isPublic = false; //eslint-disable-line
      }
    }
  );

  const result = {
    success: true,
    message: '已取消公开',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function updateDatabase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { id, name, description, isPublic } = body;

  databaseListDataSource = databaseListDataSource.map((item) => {
    if (item.id === id) {
      return { ...item, name, description, isPublic };
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

export default {
  getDatabase,
  updateDatabase,
  createDatabase,
  deleteDatabase,
  makePrivateDatabase,
  makePublicDatabase,
};
