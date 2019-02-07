import faker from 'faker';
import moment from 'moment';
import fs from 'fs';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

let tasks = [];

for (let i = 0; i < 66; i += 1) {
  tasks.push({
    name: `${faker.random.word()}-Task-${i}`,
    id: i,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
  });
}

function getTaskList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...tasks];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage * 1; // eslint-disable-line
  }

  if (params.name) {
    datasource = datasource.filter(data => data.name.indexOf(params.name) >= 0);
  }

  if (params.updatedAt) {
    const updatedAt = params.updatedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    datasource = datasource.filter(data => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[0]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    datasource = datasource.filter(data => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[0]) {
        return true;
      }
      return false;
    });
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = datasource.slice(startNum, startNum + pageSize);
  const formatedDataSource = returnDataSource.map(item => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      updatedAt: item.updatedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: datasource.length,
      pageSize,
      current: currentPage,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTaskById(req, res) {
  const params = getUrlParams(req.url);
  const p = tasks.filter(i => `${i.id}` === `${params.id}`);
  res.json(p[0]);
}

export function updateTaskById(req, res) {
  const { body } = req;
  const { id, name, description, labels } = body;
  tasks.forEach(i => {
    if (i.id === id) {
      i.name = name; // eslint-disable-line
      i.description = description; // eslint-disable-line
    }
  });
  res.json({
    message: 'success',
    success: true,
  });
}

export function deleteTaskById(req, res) {
  const { body } = req;
  const { ids } = body;
  tasks = tasks.filter(i => !ids.includes(i.id));
  res.json({
    message: 'done',
    success: true,
  });
}

export default {
  'GET /api/datapro/client/tasks/list': getTaskList,
  'POST /api/datapro/client/tasks/create': {
    success: true,
    message: '创建成功',
    id: 1,
  },
  'POST /api/datapro/client/tasks/update': updateTaskById,
  'POST /api/datapro/client/tasks/delete': deleteTaskById,
};
