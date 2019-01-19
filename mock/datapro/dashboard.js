import faker from 'faker';
import moment from 'moment';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

let dashboards = [];

for (let i = 0; i < 33; i += 1) {
  dashboards.push({
    name: `${faker.random.word()}-Dashboard-${i}`,
    id: `dashboard-${i}`,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    // labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
  });
}

export function getDashboardList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...dashboards];

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

export function deleteDashboard(req, res) {
  const { body } = req;
  const { ids } = body;

  dashboards = dashboards.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
  };
  return res.json(result);
}

export function updateDashboard(req, res) {
  const { body } = req;
  const { id, name, description, labels } = body;
  dashboards.forEach(i => {
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

export function createDashboard() {}

export function getDashboardInfoForId(req, res) {
  const params = getUrlParams(req.url);
  let dataSource = [...dashboards];
  if (params.id) {
    dataSource = dataSource.filter(data => {
      if (params.id === data.id) {
        return true;
      } else {
        return false;
      }
    });
  }
  const result = dataSource[0];
  res.json(result);
}

export default {
  'GET /api/datapro/dashboards/list': getDashboardList,
  'POST /api/datapro/dashboards/delete': deleteDashboard,
  'POST /api/datapro/dashboards/update': updateDashboard,
  'POST /api/datapro/dashboards/create': createDashboard,
  'GET /api/datapro/datashboards/get': getDashboardInfoForId,
};
