import React, { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../../../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../../../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../../../layouts/BasicLayout')),
    },
    // '/dashboard/overview': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Overview')),
    // },
    '/project/list': {
      component: dynamicWrapper(app, ['project'], () => import('../../../routes/Project/ProjectList')),
    },
    '/project/workspace': {
      component: dynamicWrapper(app, ['workspace/datainspector', 'workspace/workcanvas', 'workspace/work_component_list', 'workspace/work_component_settings'], () => import('../../../layouts/WorkspaceLayout')),
    },
    '/project/workspace/index': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Project/Workspace/WorkspaceIndex')),
    },
    '/project/workspace/editor/:id': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Project/Workspace/WorkspaceEditor')),
    },
    // '/project/workspace/dataview/:id': {
    //   component: dynamicWrapper(app, ['dataview/dataquery'],
    //     () => import('../../../routes/Project/Workspace/WorkspaceDataView')),
    // },
    // '/project/workspace/logview/:id': {
    //   component: dynamicWrapper(app, [],
    //     () => import('../../../routes/Project/Workspace/WorkspaceLogView')),
    // },

    /* model manage */
    '/models/list': {
      component: dynamicWrapper(app, ['models/models'], () => import('../../../routes/Model/ModelList')),
    },
    '/models/candidates': {
      component: dynamicWrapper(app, ['models/candidatemodels'], () => import('../../../routes/Model/CandidateModelList')),
    },
    '/models/serving/list': {
      component: dynamicWrapper(app, ['models/servingmodels'], () => import('../../../routes/Model/ServingModelList')),
    },
    '/models/serving/test/:id': {
      component: dynamicWrapper(app, ['models/modeltest'], () => import('../../../routes/Model/ModelServingTest')),
    },

    /* job manage */
    '/jobs/list': {
      component: dynamicWrapper(app, ['jobs'], () => import('../../../routes/Job/JobList')),
    },

    /* user manage. */
    '/users/list': {
      component: dynamicWrapper(app, ['users'], () => import('../../../layouts/UsersListLayout')),
    },
    '/users/list/index': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Users/UserList')),
    },
    '/users/create': {
      component: dynamicWrapper(app, ['users'], () => import('../../../routes/Users/UserCreate')),
    },
    '/users/list/edit/:userName': {
      component: dynamicWrapper(app, ['users'], () => import('../../../routes/Users/UserEdit')),
    },

    /* self manage */
    '/self/:tab?': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Self/SelfManage')),
    },

    // database
    // '/storage/dblist/index': {
    //   component: dynamicWrapper(app, ['database'],
    // () => import('../../../routes/Database/DatabaseList')),
    // },
    // '/storage/dblist/show/:table': {
    //   component: dynamicWrapper(app, ['databasedetail'],
    // () => import('../../../routes/Database/DatabaseDetail')),
    // },
    // /* database */
    // '/storage/dbquery': {
    //   component: dynamicWrapper(app, ['dataview/dataquery'],
    // () => import('../../../routes/Database/DatabaseQuery')),
    // },
    // dataset
    '/storage/dataset/index': {
      component: dynamicWrapper(app, ['dataset'], () => import('../../../routes/Dataset/DatasetList')),
    },
    '/storage/dataset/create': {
      component: dynamicWrapper(app, ['dataset'], () => import('../../../routes/Dataset/EditDataset')),
    },
    '/storage/dataset/update/:id': {
      component: dynamicWrapper(app, ['dataset'], () => import('../../../routes/Dataset/EditDataset')),
    },
    '/storage/dataset/show/:id': {
      component: dynamicWrapper(app, ['datasetdetail'], () => import('../../../routes/Dataset/DatasetDetail')),
    },
    /* center storage */
    '/storage/filelist': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Storage/StorageList')),
    },

    /**
     * The followings are used by our project. Adapted from ant-design-pro.
     */
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../../../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../../../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../../../routes/User/Login')),
    },

    /**
     *  The followings are not used by our project. Should be deleted latter.
     */

    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../../../routes/Result/Error')),
    },

    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
