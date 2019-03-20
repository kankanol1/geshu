import Privileges from '../../../src/config/UserPrivileges';

export default [
  { path: '/users', redirect: '/users/list' },
  { path: '/self', redirect: '/self/basic' },
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
];
