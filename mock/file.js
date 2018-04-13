import { getUrlParams } from './utils';

export function getFileList(req, res, u) {
  const prefix = 'hdfs://18.217.118.40:9000';
  const result = [];
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  result.push({
    path: prefix + (params.path === '/' ? '' : params.path),
    isdir: true,
  });
  switch (params.path) {
    case '/':
      result.push({
        path: `${prefix}/projectx`,
        isdir: true,
      });
      result.push({
        path: `${prefix}/shenji`,
        isdir: true,
      });
      result.push({
        path: `${prefix}/rootFile`,
        isdir: false,
      });
      break;
    case '/shenji':
      for (let i = 0; i < 5; i++) {
        result.push({
          path: `${prefix}/shenji/graphData${i}.csv`,
          isdir: false,
        });
      }
      result.push({
        path: `${prefix}/shenji/textDir`,
        isdir: true,
      });
      break;
    case '/projectx':
      for (let i = 0; i < 10; i++) {
        result.push({
          path: `${prefix}/projectx/file${i}.csv`,
          isdir: false,
        });
      }
      break;
    default:
      result.push({
        path: 'defaultFile',
        isdir: false,
      });
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  getFileList,
};
