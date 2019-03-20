import Privileges from '../../../src/config/UserPrivileges';
import loginRoute from '../includes/login';
import errorRoutes from '../includes/errors';
import baseRoutes from '../includes/base';
import dclientRoutes from '../includes/dclient';

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
      { path: '/', redirect: '/tasks/list' },
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
