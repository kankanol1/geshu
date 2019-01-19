import faker from 'faker';
import moment from 'moment';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

let datasets = [];

for (let i = 0; i < 33; i += 1) {
  datasets.push({
    name: `${faker.random.word()}-Dataset-${i}`,
    id: `xxx-ddd-eee-ccc-${i}`,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    // labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
  });
}

export function getDatasetList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...datasets];

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

export function deleteDataset(req, res) {
  const { body } = req;
  const { ids } = body;

  datasets = datasets.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
  };
  return res.json(result);
}

export function updateDataset(req, res) {
  const { body } = req;
  const { id, name, description, labels } = body;
  datasets.forEach(i => {
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

export function createDataset() {}

export function getDatasetInfoForId(req, res) {
  const params = getUrlParams(req.url);
  let dataSource = [...datasets];
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

const count = [0, 0];

export function getTableData(req, res) {
  const { pageSize, pageNum } = getUrlParams(req.url);

  // data=[{"page_tmp.value":"bye","page_tmp.rowid":1,"page_tmp.key":"good"}],
  // pagination=Pagination{total=2, pagesize=1, current=0}

  const data = [];
  for (let i = 0; i < 20; i += 1) {
    data.push({ value: `bye-page-${pageNum}-${i}`, key: `key-page-${pageNum}-${i}` });
  }

  const pagination = { total: pageSize * 10, pageSize, current: pageNum };

  const result = {
    data,
    pagination,
    meta: [
      { name: 'key', type: 'string', nullable: true },
      { name: 'value', type: 'string', nullable: true },
    ],
    success: true,
    message: '执行错误',
  };

  res.json(result);
}

export function getTableStatistics(req, res) {
  const data = {
    columns: [
      {
        name: 'c1',
        type: 'string',
      },
      {
        name: 'c2',
        type: 'numeric',
      },
      {
        name: 'c3',
        type: 'numeric',
      },
    ],
    histograms: {
      c3: [
        {
          range: '110.0-197.0',
          count: 1,
        },
        {
          range: '197.0-284.0',
          count: 1,
        },
        {
          range: '284.0-371.0',
          count: 0,
        },
        {
          range: '371.0-458.0',
          count: 0,
        },
        {
          range: '458.0-545.0',
          count: 0,
        },
        {
          range: '545.0-632.0',
          count: 0,
        },
        {
          range: '632.0-719.0',
          count: 0,
        },
        {
          range: '719.0-806.0',
          count: 0,
        },
        {
          range: '806.0-893.0',
          count: 0,
        },
        {
          range: '893.0-980.0',
          count: 1,
        },
      ],
      c1: [
        {
          range: 'name2',
          count: 1,
        },
        {
          range: 'name1',
          count: 1,
        },
        {
          range: 'n y',
          count: 1,
        },
      ],
      c2: [
        {
          range: '11.0-18.9',
          count: 1,
        },
        {
          range: '18.9-26.8',
          count: 1,
        },
        {
          range: '26.8-34.7',
          count: 0,
        },
        {
          range: '34.7-42.6',
          count: 0,
        },
        {
          range: '42.6-50.5',
          count: 0,
        },
        {
          range: '50.5-58.4',
          count: 0,
        },
        {
          range: '58.4-66.3',
          count: 0,
        },
        {
          range: '66.3-74.2',
          count: 0,
        },
        {
          range: '74.2-82.1',
          count: 0,
        },
        {
          range: '82.1-90.0',
          count: 1,
        },
      ],
    },
    statistics: {
      c3: {
        nullNum: 0,
        count: 3,
        min: 110,
        mean: 430,
        max: 980,
        stdev: 390.6404996924922,
      },
      c1: {
        nullNum: 0,
        count: 3,
        min: 0,
        mean: 0,
        max: 0,
        stdev: 0,
      },
      c2: {
        nullNum: 0,
        count: 3,
        min: 11,
        mean: 40.333333333333336,
        max: 90,
        stdev: 35.31131389355102,
      },
    },
    heatMap: {
      columns: ['c2', 'c3'],
      values: [[1, 0.9999495455006998], [0.9999495455006998, 1]],
    },
  };

  const result = {
    loading: count[0] % 3 !== 1,
    message: '计算中,请稍后...',
    data,
  };

  count[0]++;

  res.json(result);
}

export function getTableHistogram(req, res) {
  const data = {
    key: [
      {
        range: '1951 年',
        count: 38,
      },
      {
        range: '1952 年',
        count: 52,
      },
      {
        range: '1956 年',
        count: 61,
      },
      {
        range: '1957 年',
        count: 145,
      },
      {
        range: '1958 年',
        count: 48,
      },
      {
        range: '1959 年',
        count: 38,
      },
      {
        range: '1960 年',
        count: 38,
      },
      {
        range: '1962 年',
        count: 38,
      },
    ],

    value: [
      {
        range: '1951 年',
        count: 38,
      },
      {
        range: '1952 年',
        count: 52,
      },
      {
        range: '1956 年',
        count: 61,
      },
      {
        range: '1957 年',
        count: 145,
      },
      {
        range: '1958 年',
        count: 48,
      },
      {
        range: '1959 年',
        count: 38,
      },
      {
        range: '1960 年',
        count: 38,
      },
      {
        range: '1962 年',
        count: 38,
      },
    ],
  };
  const result = {
    loading: count[1] % 3 !== 1,
    message: '计算中，请稍后....',
    data,
  };

  count[1]++;

  res.json(result);
}

export default {
  'GET /api/datapro/datasets/list': getDatasetList,
  'POST /api/datapro/datasets/delete': deleteDataset,
  'POST /api/datapro/datasets/update': updateDataset,
  'POST /api/datapro/datasets/create': createDataset,
  'GET /api/datapro/datasets/get': getDatasetInfoForId,

  // queries for a single dataset.
  'GET /api/datapro/datasets/query/data': getTableData,
  'GET /api/datapro/datasets/query/statistics': getTableStatistics,
  'GET /api/datapro/datasets/query/histogram': getTableHistogram,
};
