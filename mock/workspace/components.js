
export function fetchSchema(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }


  const body = (b && b.body) || req.body;

  // eslint-disable-next-line
  console.log('save: project id, component id', req.params.projectId, req.params.componentId);
  // console.log('saved', body);


  const result = {
    success: true,
    message: '错了',
    data: [
      {
        name: 'key',
        type: '"string"',
        nullable: false,
      },
      {
        name: 'value',
        type: '"string"',
        nullable: true,
      },
    ],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
