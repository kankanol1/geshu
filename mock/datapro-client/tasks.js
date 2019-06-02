import faker from 'faker';
import moment from 'moment';
import fs from 'fs';
import { getUrlParams } from '../utils';

faker.locale = 'zh_CN';

let tasks = [];

for (let i = 0; i < 66; i += 1) {
  const rad1 = Math.random() * 10;
  tasks.push({
    name: `${faker.random.word()}-Task-${i}`,
    id: i,
    description: faker.hacker.phrase(),
    createdBy: i,
    createdAt: moment(faker.date.past()),
    updatedAt: moment(faker.date.past()),
    labels: faker.random.words(parseInt(Math.random() * 10 + 1, 10)).split(' '),
    status: 'CREATED',
    // rad1 < 3 ? 'TEMPLATE_DEFINED' : rad1 > 7 ? 'SOURCE_DEFINED' : rad1 < 5 ? 'READY' : 'CREATED',
    templateId: 1,
    sourceConfigs: {
      id1: {
        componentType: 'FileDataSource',
        format: {
          formatClass: 'CSV',
          ignoreFirstLine: false,
          fieldDelimiter: '|',
        },
        source: {
          path: {
            type: 'private',
            path: '/private-rootFile',
            projectId: -1,
            projectName: '无项目',
            fullPath: 'hdfs://18.217.118.40:9000/private-rootFile',
          },
        },
      },
      id2: {},
    },
    sinkConfigs: { output: {} },
  });
}

function getTaskList(req, res) {
  const params = getUrlParams(req.url);

  let datasource = [...tasks];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage * 1; // eslint-disable-line
  }

  if (params.name) {
    datasource = datasource.filter(data => data.name.indexOf(params.name) >= 0);
  }

  if (params.updatedAt) {
    const updatedAt = params.updatedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    datasource = datasource.filter(data => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[0]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    datasource = datasource.filter(data => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[0]) {
        return true;
      }
      return false;
    });
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = datasource.slice(startNum, startNum + pageSize);
  const formatedDataSource = returnDataSource.map(item => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      updatedAt: item.updatedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: datasource.length,
      pageSize,
      current: currentPage,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTaskById(req, res) {
  const params = getUrlParams(req.url);
  const p = tasks.filter(i => `${i.id}` === `${params.id}`);
  res.json(p[0]);
}

export function updateTaskById(req, res) {
  const { body } = req;
  const { id, name, description, labels } = body;
  tasks.forEach(i => {
    if (i.id === id) {
      i.name = name; // eslint-disable-line
      i.description = description; // eslint-disable-line
    }
  });
  res.json({
    message: 'success',
    success: true,
  });
}

export function deleteTaskById(req, res) {
  const { body } = req;
  const { ids } = body;
  tasks = tasks.filter(i => !ids.includes(i.id));
  res.json({
    message: 'done',
    success: true,
  });
}

export function configTaskSource(req, res) {
  const success = Math.random() * 10 > 5;
  if (success) {
    const { body } = req;
    const { id } = body;
    tasks.forEach(i => {
      if (i.id === parseInt(id, 10)) {
        i.status = 'SOURCES_DEFINED'; // eslint-disable-line
      }
    });
    res.json({
      message: 'done',
      success: true,
    });
  } else {
    res.json({
      message: '配置存储出错，请重试',
      success: false,
    });
  }
}

export function configTaskSink(req, res) {
  const success = Math.random() * 10 > 5;
  if (success) {
    const { body } = req;
    const { id } = body;
    tasks.forEach(i => {
      if (i.id === parseInt(id, 10)) {
        i.status = 'READY'; // eslint-disable-line
      }
    });
    res.json({
      message: 'done',
      success: true,
    });
  } else {
    res.json({
      message: '配置存储出错，请重试',
      success: false,
    });
  }
}

export function validateTaskSource(req, res) {
  // const success = Math.random() * 10 > 5;
  const success = false;
  if (success) {
    res.json({
      message: 'done',
      success: true,
    });
  } else {
    res.json({
      message: '验证失败',
      success: false,
      data: [
        {
          id: 'id1',
          name: 'xxx',
          description: 'dscp1',
          expected: [
            { name: 'a1', type: 'String', nullable: false },
            { name: 'a2', type: 'String', nullable: false },
            { name: 'a3', type: 'String', nullable: false },
            { name: 'a4', type: 'String', nullable: false },
            { name: 'a5', type: 'String', nullable: false },
          ],
          given: [
            { name: 'a1', type: 'String', nullable: false },
            { name: 'a2', type: 'String', nullable: false },
            { name: 'a3', type: 'String', nullable: false },
            { name: 'a4', type: 'String', nullable: false },
            { name: 'a5', type: 'String', nullable: false },
          ],
          mapping: [
            { expected: 'a1', given: 'a1', compatible: 'OK' },
            { expected: 'a2', given: 'a1', compatible: 'OK' },
            { expected: 'a3', given: 'a1', compatible: 'WARN' },
            { expected: 'a4', given: 'a1', compatible: 'ERROR' },
            { expected: 'a5', given: 'a1', compatible: 'OK' },
          ],
        },
        {
          id: 'id2',
          name: 'xxx909d',
          description: 'dscp12',
          expected: [
            { name: 'a1', type: 'String', nullable: false },
            { name: 'a2', type: 'String', nullable: false },
            { name: 'a3', type: 'String', nullable: false },
          ],
          given: [
            { name: 'a1', type: 'String', nullable: false },
            { name: 'a2', type: 'String', nullable: false },
            { name: 'a3', type: 'String', nullable: false },
          ],
          mapping: [
            { expected: 'a1', given: 'a1', compatible: 'OK' },
            { expected: 'a2', given: 'a1', compatible: 'OK' },
            { expected: 'a3', given: 'a1', compatible: 'WARN' },
          ],
        },
      ],
    });
  }
}

export function configTemplate(req, res) {
  res.json({
    message: 'done',
    success: true,
  });
}

export default {
  'GET /api/datapro/client/tasks/list': getTaskList,
  'GET /api/datapro/client/tasks/get': getTaskById,
  'POST /api/datapro/client/tasks/create': {
    success: true,
    message: '创建成功',
    id: 1,
  },
  'POST /api/datapro/client/tasks/update': updateTaskById,
  'POST /api/datapro/client/tasks/delete': deleteTaskById,
  'POST /api/datapro/client/tasks/run': {
    success: true,
    msessage: '已启动运行',
  },
  'POST /api/datapro/client/tasks/conf/template': configTemplate,
  'POST /api/datapro/client/tasks/conf/source': configTaskSource,
  'POST /api/datapro/client/tasks/conf/sink': configTaskSink,
  'POST /api/datapro/client/tasks/conf/validate/source': validateTaskSource,
  'POST /api/datapro/client/tasks/conf/validate/sink': validateTaskSource,
};
