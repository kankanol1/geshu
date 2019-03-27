import Privileges from '../../../src/config/UserPrivileges';
import loginRoute from '../includes/login';
import errorRoutes from '../includes/errors';
import baseRoutes from '../includes/base';
import dclientRoutes from '../includes/dclient';
import testRoutes from '../includes/tests';

export default [
  // user
  loginRoute,
  // app
  {
    path: '/',
    component: '../layouts/XBasicLayout',
    Routes: ['src/pages/AsyncAuthorized'],
    authority: [Privileges.LOGIN_USER],
    routes: [
      { path: '/', redirect: '/projects/list' },
      { path: '/projects', redirect: '/projects/list' },
      // { path: '/teams', redirect: '/teams/list' },
      ...testRoutes,
      {
        path: '/projects',
        name: 'project',
        icon: 'bulb',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/projects/list',
            name: 'list',
            hideInMenu: true,
            component: './DataPro/Projects/ProjectList',
          },
          {
            path: '/projects/create',
            name: 'create',
            hideInMenu: true,
            component: './DataPro/Projects/CreateProject',
          },
          {
            // all the sub-pages indices
            path: '/projects/p/:pane(show|pipeline|dataset|files|versions|settings)/:id',
            hideInMenu: true,
            component: './DataPro/Projects/ProjectIndex',
          },
          {
            // for configure operation.
            path: '/projects/p/pipeline/:id/:type(new|conf)/:op',
            hideInMenu: true,
            component: './DataPro/Projects/Project/Pipeline/Configs/Index',
          },
          {
            // for publish pipeline
            path: '/projects/p/pipeline/:id/publish',
            hideInMenu: true,
            component: './DataPro/Projects/Project/Pipeline/Publish/PublishIndex',
          },
          {
            // for dataset details page.
            path: '/projects/p/dataset/:id/:datasetId',
            hideInMenu: true,
            component: './DataPro/Projects/Project/Dataset/Index',
          },
          // {
          //   // for dashboard details page.
          //   path: '/projects/p/dashboard/:id/:dashboardId',
          //   hideInMenu: true,
          //   component: './DataPro/Projects/Project/Dashboard/Index',
          // },
        ],
      },
      // {
      //   path: 'teams',
      //   name: 'teams',
      //   icon: 'team',
      //   hideChildrenInMenu: true,
      //   routes: [
      //     {
      //       path: 'list',
      //       name: 'list',
      //       component: './Teams/TeamsList',
      //     },
      //   ],
      // },
      ...dclientRoutes,
      {
        path: '/files',
        icon: 'database',
        name: 'files',
        component: './DClient/Files/StorageList',
      },
      ...baseRoutes,
      ...errorRoutes,
    ],
  },
];
