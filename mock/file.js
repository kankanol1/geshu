import { getUrlParams } from './utils';

export function gitFileList(req, res, u) {
  const result = [];
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  if (params.path === '/') {
    for (let i = 0; i < 2; i++) {
      result.push({
        path: `/file${i}`,
        isdir: true,
      });
    }
  } else if (params.path === '/file0') {
    for (let i = 0; i < 2; i++) {
      result.push({
        path: `/file1/text${i}`,
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

export function saveFileList(req, res) {
  const result = {
    success: true,
    message: '保存成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  gitFileList,
  saveFileList,
};
