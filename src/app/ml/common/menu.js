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
  },
  {
    name: '中心存储',
    icon: 'database',
    path: 'storage',
    children: [{
      name: '文件列表',
      path: 'filelist',
    }, {
      name: '数据集列表',
      path: 'dataset',
    },
    //  {
    //   name: '数据库查询',
    //   path: 'dbquery',
    // }
    ],
  }, {
    name: '作业管理',
    icon: 'schedule',
    path: 'jobs',
    children: [{
      name: '作业列表',
      path: 'list',
    }],
  }, {
    name: '模型管理',
    icon: 'api',
    path: 'models',
    children: [{
      name: '待选模型库',
      path: 'candidates',
    }, {
      name: '模型库',
      path: 'list',
    }, {
      name: '模型服务',
      path: 'serving',
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
