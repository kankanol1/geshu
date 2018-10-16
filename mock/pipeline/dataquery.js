import { getUrlParams } from '../utils';

export function getQueryResult(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

  const { pageSize, pageNum } = body;

  // data=[{"page_tmp.value":"bye","page_tmp.rowid":1,"page_tmp.key":"good"}],
  // pagination=Pagination{total=2, pagesize=1, current=0}

  const data = [];
  for (let i = 0; i < pageSize; i += 1) {
    data.push({ value: `bye-page-${pageNum}-${i}`, key: `key-page-${pageNum}-${i}` });
  }

  const pagination = { total: pageSize * 10, pagesize: pageSize, current: pageNum };

  const result = {
    data,
    pagination,
    meta: [{ size: 1, name: 'key', label: 'key' }, { size: 1, name: 'value', label: 'value' }],
    success: true,
    message: '执行错误',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getLastestDatabasesForProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  const projectId = params.projectId === undefined ? 1 : parseInt(params.projectId, 10);
  const result = [
    {
      tableName: 'xxx_ttt_xxx',
      projectId,
      jobId: '233',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yyyy',
      name: 'hi',
      persist: true,
      schema: [{ name: 'key', type: 'varchar' }, { name: 'value', type: 'varchar' }],
    },
    {
      tableName: 'xxx_zzz_xxx',
      projectId,
      jobId: '234',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yzzy',
      name: 'hai',
      persist: false,
      schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
    },
  ];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function persistDataQuery(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  const body = (b && b.body) || req.body;
  const projectId = params.projectId === undefined ? 1 : parseInt(params.projectId, 10);
  const result = [
    {
      tableName: 'xxx_ttt_xxx',
      projectId,
      jobId: '233',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yyyy',
      name: 'hi',
      persist: true,
      schema: [{ name: 'key', type: 'varchar' }, { name: 'value', type: 'varchar' }],
    },
    {
      tableName: 'xxx_zzz_xxx',
      projectId,
      jobId: '234',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yzzy',
      name: 'hai',
      persist: true,
      schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
    },
  ];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export default {
  // query data releated metadata.
  'GET /api/workspace/dataview/': getLastestDatabasesForProject,
  // data query. Not used.
  // 'POST /api/data/hive/querytmp': getQueryResult,
  // 'POST /api/data/hive/query': getQueryResult,
  // 'POST /api/data/hive/persist': persistDataQuery,
};
