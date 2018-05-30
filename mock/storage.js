/* eslint-disable */
import { getUrlParams } from './utils';

const projects = [
  {
    name: '项目1',
    description: '项目1描述',
    id: 1,
  },
  {
    name: '项目12',
    description: '项目12描述',
    id: 2,
  },
  {
    name: '项目13',
    description: '项目13描述',
    id: 3,
  },
  {
    name: '项目14',
    description: '项目14描述',
    id: 4,
  },
  {
    name: '项目15',
    description: '项目15描述',
    id: 5,
  },
];

export function allProjectListForStorage(req, res, u, b) {
  const result = projects;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function listFileForType(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const { type, id, path } = params;
  // type: private, public, project
  // id: project id,
  // path: visiting path for the type.
  const result = [];
  const prefix = 'hdfs://18.217.118.40:9000';

  result.push({
    path: prefix + (params.path === '/' ? '' : params.path),
    rpath: params.path,
    isdir: true,
  });

  switch (params.path) {
    case '/':
      result.push({
        path: `${prefix}/${type}-projectx`,
        rpath: `/${type}-projectx`,
        isdir: true,
      });
      result.push({
        path: `${prefix}/${type}-shenji`,
        rpath: `/${type}-shenji`,
        isdir: true,
      });
      result.push({
        path: `${prefix}/${type}-rootFile`,
        rpath: `/${type}-rootFile`,
        isdir: false,
      });
      break;
    case `/${type}-shenji`:
      for (let i = 0; i < 5; i++) {
        result.push({
          path: `${prefix}/${type}-shenji/graphData${i}.csv`,
          rpath: `/${type}-shenji/graphData${i}.csv`,
          isdir: false,
        });
      }
      result.push({
        path: `${prefix}/${type}-shenji/textDir`,
        rpath: `/${type}-shenji/textDir`,
        isdir: true,
      });
      break;
    case `/${type}-projectx`:
      const files = ['person.csv', 'software.csv', 'knows.csv', 'created.csv'];
      for (const i in files) {
        result.push({
          path: `${prefix}/${type}-projectx/${files[i]}`,
          rpath: `/${type}-projectx/${files[i]}`,
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
  allProjectListForStorage, 
  listFileForType
};
