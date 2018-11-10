import faker from 'faker';
import moment from 'moment';
import fs from 'fs';
import { getUrlParams } from '../utils';

const projects = [];

for (let i = 0; i < 66; i += 1) {
  projects.push({
    name: `${faker.random.word()}-Project-${i}`,
    id: i,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
  });
}

function getProjectList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...projects];

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

export function getProjectById(req, res) {
  const params = getUrlParams(req.url);
  const p = projects.filter(i => `${i.id}` === `${params.id}`);
  res.json(p[0]);
}

export function getProjectCount(req, res) {
  res.json({
    pipeline: 0,
    dataset: 0,
    dashboard: 0,
    commit: 2,
  });
}

export function getProjectMarkdown(req, res) {
  res.json({
    md: fs.readFileSync('./mock/file/markdownTest.md', 'utf-8'),
  });
}

export default {
  'GET /api/datapro/projects/list/all': getProjectList,
  'GET /api/datapro/projects/p/info': getProjectById,
  'GET /api/datapro/projects/p/count': getProjectCount,
  'GET /api/datapro/projects/p/readme': getProjectMarkdown,
};