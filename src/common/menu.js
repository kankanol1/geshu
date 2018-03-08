import { isUrl } from '../utils/utils';

const menuData = [{
  name: '仪表盘',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '概览',
    path: 'overview',
    // hideInMenu: true,
  }],
}, {
  name: '项目管理',
  icon: 'bulb',
  path: 'project',
  children: [{
    name: '项目列表',
    path: 'list',
  }, {
    name: '工作区',
    path: 'workspace',
  }],
}, {
  name: '模型管理',
  icon: 'api',
  path: 'models',
  children: [{
    name: '模型库',
    path: 'list',
  }, {
    name: '待选模型库',
    path: 'candidates',
  }],
}, {
  name: '作业管理',
  icon: 'schedule',
  path: 'jobs',
  children: [{
    name: '作业列表',
    path: 'list',
  }, {
    name: '添加作业',
    path: 'new',
  }],
}, {
  name: '图数据管理',
  icon: 'share-alt',
  path: 'graph',
  children: [{
    name: '设计器',
    path: 'editor',
  }, {
    name: '数据导入',
    path: 'mapper',
  }, {
    name: '数据查询',
    path: 'query',
  }, {
    name: '数据探索',
    path: 'explore',
  }],
}, {
  name: '用户管理',
  icon: 'contacts',
  path: 'users',
  authority: 'admin',
  children: [{
    name: '用户列表',
    path: 'list',
  }, {
    name: '添加用户',
    path: 'create',
  }],
}, {
  name: '系统管理',
  icon: 'setting',
  path: 'system',
  children: [{
    name: '日志管理',
    path: 'log',
  }, {
    name: '参数设置',
    path: 'params',
  }],
}, {
  name: '使用文档',
  icon: 'book',
  path: 'http://pro.ant.design/docs/getting-started',
  target: '_blank',
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
