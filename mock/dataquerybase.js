import { getUrlParams } from './utils';

export function getTableData(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

  const { pageSize, pageNum } = body;

  // data=[{"page_tmp.value":"bye","page_tmp.rowid":1,"page_tmp.key":"good"}],
  // pagination=Pagination{total=2, pagesize=1, current=0}

  const data = [];
  for (let i = 0; i < 20; i += 1) {
    data.push({ value: `bye-page-${pageNum}-${i}`, key: `key-page-${pageNum}-${i}` });
  }

  const pagination = { total: pageSize * 10, pagesize: pageSize, current: pageNum };

  const result = { data,
    pagination,
    meta:
    [
      { size: 1, name: 'key', label: 'key' },
      { size: 1, name: 'value', label: 'value' },
    ],
    success: true,
    message: '执行错误',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTableHeatmap(req, res, u, b) {
  const result = {
    columns: ['v1', 'v2', 'v3', 'v4'],
    values: [
      ['NaN', 0.2, 0.3, 0.4],
      [0.1, 'NaN', 0.6, 0.4],
      [0.6, 0.6, 'NaN', 0.9],
      [0.8, 0.6, 0.1, 'NaN'],
    ],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTableHistogram(req, res, u, b) {
  const result = {
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

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
