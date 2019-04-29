import Privileges from '../../../src/config/UserPrivileges';
import loginRoute from '../includes/login';
import errorRoutes from '../includes/errors';
import baseRoutes from '../includes/base';
import dprojectRoutes from '../includes/dprojects';
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
      // { path: '/teams', redirect: '/teams/list' },
      ...testRoutes,
      ...dprojectRoutes,
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
      // ...dclientRoutes,
      // {
      //   path: '/files',
      //   icon: 'database',
      //   name: 'files',
      //   component: './DClient/Files/StorageList',
      // },
      ...baseRoutes,
      ...errorRoutes,
    ],
  },
];
