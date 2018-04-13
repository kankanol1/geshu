import { getUrlParams } from './utils';

export function getFileList(req, res, u) {
  const result = [];
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  result.push({
    path: params.path,
    isdir: true,
  });
  if (params.path === '/') {
    for (let i = 0; i < 2; i++) {
      result.push({
        path: `/file${i}`,
        isdir: true,
      });
    }
  } else if (params.path === '/file0' || params.path === '/file1') {
    for (let i = 0; i < 2; i++) {
      result.push({
        path: `${params.path}/text${i}`,
        isdir: false,
      });
    }
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
