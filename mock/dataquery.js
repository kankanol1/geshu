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

  const pagination = { total: pageSize * 10, pageSize, current: pageNum };

  const result = { data,
    pagination,
    meta:
    [
      { size: 1, name: 'key', label: 'key' },
      { size: 1, name: 'value', label: 'value' }],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
