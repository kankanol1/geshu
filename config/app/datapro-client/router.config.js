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
      { path: '/', redirect: '/tasks/list' },
      { path: '/tasks', redirect: '/tasks/list' },
      { path: '/users', redirect: '/users/list' },
      { path: '/self', redirect: '/self/basic' },
      {
        path: '/tasks',
        name: 'tasks',
        icon: 'bulb',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/tasks/list',
            name: 'list',
            hideInMenu: true,
            component: './DClient/Tasks/TaskList',
          },
          {
            path: '/tasks/t/show/:id/:pane?',
            hideInMenu: true,
            component: './DClient/Tasks/TaskIndex',
          },
          {
            path: '/tasks/t/new',
            hideInMenu: true,
            component: './DClient/Tasks/Edit/CreateTask',
          },
          {
            path: '/tasks/t/:mode(edit|create)/:id/:pane?',
            hideInMenu: true,
            component: './DClient/Tasks/Edit/EditTask',
          },
        ],
      },
      {
        path: '/files',
        icon: 'database',
        name: 'files',
        component: './DClient/Files/StorageList',
      },
      {
        path: 'users',
        name: 'users',
        icon: 'contacts',
        authority: [Privileges.USER_VIEW],
        hideChildrenInMenu: true,
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
