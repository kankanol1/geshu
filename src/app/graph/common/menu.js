import { isUrl } from '../../../utils/utils';
import { putToRegistry } from '../../../common/registry';

const menuData = [
  // {
  //   name: '仪表盘',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [{
  //     name: '概览',
  //     path: 'overview',
  //   // hideInMenu: true,
  //   }],
  // },
  {
    name: '中心存储',
    icon: 'file',
    path: 'storage',
    children: [{
      name: '文件列表',
      path: 'list',
    }],
  }, {
    name: '图数据管理',
    icon: 'share-alt',
    path: 'graph',
    children: [{
      name: '图项目列表',
      path: 'list',
    },
    {
      name: '图作业管理',
      path: 'jobs',
    }, {
      name: '设计器',
      path: 'schema',
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
  },
  // {
  //   name: '系统管理',
  //   icon: 'setting',
  //   path: 'system',
  //   children: [{
  //     name: '日志管理',
  //     path: 'log',
  //   }, {
  //     name: '参数设置',
  //     path: 'params',
  //   }],
  // },
  {
    name: '个人中心',
    icon: 'user',
    path: 'self',
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

putToRegistry('menuData', () => formatter(menuData));

export const getMenuData = () => formatter(menuData);