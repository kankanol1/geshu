import moment from 'moment';
import { getUrlParams } from './utils';

/**
 * job related mock.
 */

const allStatus = [
  'initialized',
  'queued',
  'started',
  'canceled',
  'finished',
  'failed',
];

let jobDataSource = [{
  id: '957c7239-8320-4868-976d-83a178050157',
  projectName: 'Project-1',
  projectId: '9',
  status: 'finished',
  progress: 0.8,
  createdAt: moment('2018-01-08', 'YYYY-MM-DD'),
  finishedAt: moment('2018-01-08', 'YYYY-MM-DD'),
  runningTime: 10000, // in seconds.
  modelName: '模型名称',
  modelId: '模型id',
}];

let num = 1000;
const gen = () => {
  return num++;
};

for (let i = 0; i < 66; i += 1) {
  jobDataSource.push({
    id: `${i}`,
    projectName: `Project-${i}`,
    projectId: Math.floor(i / 12),
    status: allStatus[i % allStatus.length],
    progress: 0.1 * (i % 10),
    createdAt: moment('2018-01-08', 'YYYY-MM-DD'),
    finishedAt: moment('2018-01-08', 'YYYY-MM-DD'),
    runningTime: 100000 * [i % 50], // in seconds.
    modelName: '模型名称',
    modelId: `模型id${i}`,
  });
}

export function getJobs(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...jobDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.projectName) {
    dataSource = dataSource.filter(data => data.projectName.indexOf(params.projectName) >= 0);
  }

  if (params.modelName) {
    dataSource = dataSource.filter(data => data.modelName.indexOf(params.modelName) >= 0);
  }

  if (params.status) {
    dataSource = dataSource.filter(data => data.status === params.status);
  }

  if (params.finishedAt) {
    const finishedAt = params.finishedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.updatedAt >= finishedAt[0] && data.updatedAt <= finishedAt[1]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[1]) {
        return true;
      }
      return false;
    });
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage; // eslint-disable-line
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = dataSource.slice(startNum, startNum + pageSize);

  const formatedDataSource = returnDataSource.map((item) => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      finishedAt: item.finishedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteJobs(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  jobDataSource = jobDataSource.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function pauseJobs(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  jobDataSource.forEach(
    (job) => {
      if (ids.includes(job.id)) {
        job.status = 'paused'; //eslint-disable-line
      }
    }
  );
  const result = {
    success: true,
    message: '暂停成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function resumeJobs(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  jobDataSource.forEach(
    (job) => {
      if (ids.includes(job.id)) {
        job.status = 'doing'; //eslint-disable-line
      }
    }
  );
  const result = {
    success: true,
    message: '暂停成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function restartJobs(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  jobDataSource.forEach(
    (job) => {
      if (ids.includes(job.id)) {
        job.status = 'doing'; //eslint-disable-line
      }
    }
  );
  const result = {
    success: true,
    message: '重启成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function cancelJobs(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  jobDataSource.forEach(
    (job) => {
      if (ids.includes(job.id)) {
        job.status = 'canceled'; //eslint-disable-line
      }
    }
  );
  const result = {
    success: true,
    message: '取消成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getJobDetails(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const dataList = [
    {
      id: '1',
      createdAt: moment('2018-01-08', 'YYYY-MM-DD'),
      name: '文件名称',
      schema: [],
    },
  ];

  const modelList = [{
    id: '1',
    createdAt: moment('2018-01-08', 'YYYY-MM-DD'),
    name: '文件名称',
  }];

  const result = {
    id: params.id,
    projectName: '项目名称1',
    projectId: 1,
    dataList,
    modelList,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getJobs,
  deleteJobs,
  resumeJobs,
  pauseJobs,
  restartJobs,
  cancelJobs,
};
