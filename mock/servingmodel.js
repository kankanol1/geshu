import moment from 'moment';
import { getUrlParams } from './utils';

let models = [
  { id: 'gen-1',
    name: 'c模型1',
    description: '模型描述',
    url: 'http://localhost:8080/serving/model-xxx',
    publishedAt: moment('2018-03-02', 'YYYY-MM-DD'),
  },
];

for (let i = 0; i < 66; i += 1) {
  models.push({
    id: `gen${i}`,
    name: `c模型${i}`,
    description: `模型描述${i}`,
    url: `http://localhost:8080/serving/model-${i}`,
    publishedAt: moment('2018-03-02', 'YYYY-MM-DD'),
  });
}

export function getServingModels(req, res, u) {
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

  if (params.url) {
    dataSource = dataSource.filter(data => data.url.indexOf(params.url) >= 0);
  }

  if (params.publishedAt) {
    const publishedAt = params.publishedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.publishedAt >= publishedAt[0] && data.publishedAt <= publishedAt[1]) {
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
      publishedAt: item.publishedAt.format('YYYY-MM-DD HH:mm'),
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

export function offlineServingModels(req, res, u, b) {
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

export default {
  offlineServingModels,
  getServingModels,
};
