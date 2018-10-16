/* eslint-disable */
import { getUrlParams } from '../utils';

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
      const files = ['person.csv', 'software.csv', 'knows.csv', 'created.csv'];
      for (const i in files) {
        result.push({
          path: `${prefix}/projectx/${files[i]}`,
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

export function postFileUpload(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  const result = {
    success: true,
    message: '上传成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getPreviewData(req, res, u, b) {
  const result = [];
  for (let i = 0; i < 5; i++) {
    result.push(
      'data1-' +
        i +
        ',' +
        'data2-' +
        i +
        ',' +
        'data3-' +
        i +
        ',' +
        'data4-' +
        i +
        ',' +
        'data5-' +
        i +
        ',' +
        'data6-' +
        i +
        ',' +
        'data7-' +
        i +
        ',' +
        'data8-' +
        i +
        ',' +
        'data9-' +
        i +
        ',' +
        'data10-' +
        i +
        ','
    );
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  // file list. NOT USED(maybe)
  // 'GET /api/fs/ls': getFileList,
  // 'GET /api/fs/sample': getPreviewData,
  // 'POST /api/fs/upload': postFileUpload,
};
