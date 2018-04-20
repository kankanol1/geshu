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
        app.model(require(`../models/${model}`).default);
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
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
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
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    // '/dashboard/overview': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Overview')),
    // },
    '/project/list': {
      component: dynamicWrapper(app, ['project'], () => import('../routes/Project/ProjectList')),
    },
    '/project/workspace': {
      component: dynamicWrapper(app, ['workspace/work_canvas', 'workspace/work_component_list', 'workspace/work_component_settings'], () => import('../layouts/WorkspaceLayout')),
    },
    '/project/workspace/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Project/WorkspaceIndex')),
    },
    '/project/workspace/editor/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Project/WorkspaceEditor')),
    },
    '/project/workspace/dataview/:id': {
      component: dynamicWrapper(app, ['dataview/dataquery'], () => import('../routes/Project/WorkspaceDataView')),
    },
    '/project/workspace/logview/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Project/WorkspaceLogView')),
    },

    /* model manage */
    '/models/list': {
      component: dynamicWrapper(app, ['models/models'], () => import('../routes/Model/ModelList')),
    },
    '/models/candidates': {
      component: dynamicWrapper(app, ['models/candidatemodels'], () => import('../routes/Model/CandidateModelList')),
    },
    '/models/serving': {
      component: dynamicWrapper(app, ['models/servingmodels'], () => import('../routes/Model/ServingModelList')),
    },

    /* job manage */
    '/jobs/list': {
      component: dynamicWrapper(app, ['jobs'], () => import('../routes/Job/JobList')),
    },

    /* user manage. */
    '/users/list': {
      component: dynamicWrapper(app, ['users'], () => import('../layouts/UsersListLayout')),
    },
    '/users/list/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/UserList')),
    },
    '/users/create': {
      component: dynamicWrapper(app, ['users'], () => import('../routes/Users/UserCreate')),
    },
    '/users/list/edit/:userName': {
      component: dynamicWrapper(app, ['users'], () => import('../routes/Users/UserEdit')),
    },

    /* self manage */
    '/self/:tab?': {
      component: dynamicWrapper(app, [], () => import('../routes/Self/SelfManage')),
    },

    /* database */
    '/database/query': {
      component: dynamicWrapper(app, [], () => import('../routes/Database/DatabaseQuery')),
    },

    /**
     * The followings are used by our project. Adapted from ant-design-pro.
     */
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },

    /**
     *  The followings are not used by our project. Should be deleted latter.
     */


    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },

    '/graph': {
      component: dynamicWrapper(app, [], () => import('../layouts/GraphLayout')),
    },
    '/graph/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Graph/GraphList')),
    },
    '/graph/jobs': {
      component: dynamicWrapper(app, ['graph/graph_job'], () => import('../routes/Graph/GraphJobList')),
    },
    // '/graph/schema': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/GraphLayout')),
    // },
    // '/graph/explore': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/GraphLayout')),
    // },
    // '/graph/query': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/GraphLayout')),
    // },
    // '/graph/mapper': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/GraphLayout')),
    // },
    '/graph/index/:type': {
      component: dynamicWrapper(app, ['graph/graph'], () => import('../routes/Graph/GraphIndex')),
    },
    '/graph/detail/schema/:id': {
      component: dynamicWrapper(app, ['graph/graph_schema_editor'], () => import('../routes/Graph/schema/SchemaDesigner')),
    },
    '/graph/detail/mapper/:id': {
      component: dynamicWrapper(app, ['graph/graph_mapping_editor'], () => import('../routes/Graph/mapping/MappingDesigner')),
    },
    '/graph/detail/query/:id': {
      component: dynamicWrapper(app, ['graph/graph_query'], () => import('../routes/Graph/query/GraphQuery')),
    },
    '/graph/detail/explore/:id': {
      component: dynamicWrapper(app, ['graph/graph_explore'], () => import('../routes/Graph/explore/GraphExplore')),
    },
    // database
    '/database/list': {
      component: dynamicWrapper(app, ['database'], () => import('../routes/Database/DatabaseList')),
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
