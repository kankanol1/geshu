import faker from 'faker';
import moment from 'moment';
import fs from 'fs';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

let jobs = [];

for (let i = 0; i < 66; i += 1) {
  const rad1 = Math.random() * 10;
  jobs.push({
    name: `${faker.random.word()}-Job-${i}`,
    id: i,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
    status: rad1 < 3 ? 'RUNNING' : rad1 > 7 ? 'DONE' : rad1 < 5 ? 'READY' : 'NOT_READY',
  });
}

function getJobList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...jobs];

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

export function getJobById(req, res) {
  const params = getUrlParams(req.url);
  const p = jobs.filter(i => `${i.id}` === `${params.id}`);
  res.json(p[0]);
}

export function updateJobById(req, res) {
  const { body } = req;
  const { id, name, description, labels } = body;
  jobs.forEach(i => {
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

export function deleteJobById(req, res) {
  const { body } = req;
  const { ids } = body;
  jobs = jobs.filter(i => !ids.includes(i.id));
  res.json({
    message: 'done',
    success: true,
  });
}

export default {
  'GET /api/datapro/client/jobs/list': getJobList,
  'GET /api/datapro/client/jobs/get': getJobById,
  'POST /api/datapro/client/jobs/create': {
    success: true,
    message: '创建成功',
    id: 1,
  },
  'POST /api/datapro/client/jobs/update': updateJobById,
  'POST /api/datapro/client/jobs/delete': deleteJobById,
};
