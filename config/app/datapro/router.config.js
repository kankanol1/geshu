import Privileges from '../../../src/config/UserPrivileges';

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/XBasicLayout',
    Routes: ['src/pages/AsyncAuthorized'],
    authority: [Privileges.LOGIN_USER],
    routes: [
      { path: '/', redirect: '/projects/list' },
      { path: '/self', redirect: '/self/basic' },
      {
        path: '/testm',
        name: 'testm',
        hideInMenu: true,
        component: './Test/TestMarkdown',
      },
      {
        path: '/projects',
        name: 'project',
        icon: 'bulb',
        routes: [
          {
            path: '/projects/list',
            name: 'list',
            component: './DataPro/Projects/ProjectList',
          },
        ],
      },
      {
        path: 'users',
        name: 'users',
        icon: 'contacts',
        authority: [Privileges.USER_VIEW],
        routes: [
          {
            path: 'list',
            authority: [Privileges.USER_VIEW],
            name: 'list',
            redirect: '/users/list/index',
          },
          { path: 'list/index', authority: [Privileges.USER_VIEW], component: './Users/UserList' },
          {
            path: 'list/edit/:userName',
            authority: [Privileges.USER_MODIFY],
            component: './Users/UserEdit',
          },
          {
            path: 'create',
            authority: [Privileges.USER_ADD],
            name: 'create',
            component: './Users/UserEdit',
          },
        ],
      },
      {
        path: 'self',
        icon: 'user',
        name: 'self',
        routes: [{ path: ':tab?', component: './Self/SelfManage' }],
      },
      {
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
