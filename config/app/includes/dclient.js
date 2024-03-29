export default [
  { path: '/tasks', redirect: '/tasks/list' },
  {
    path: '/tasks',
    name: 'tasks',
    icon: 'schedule',
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
        path: '/tasks/t/timer/:id',
        hideInMenu: true,
        component: './DClient/Tasks/Edit/SetTimer',
      },
      {
        path: '/tasks/t/:mode(edit|create)/:id/:pane?',
        hideInMenu: true,
        component: './DClient/Tasks/Edit/EditTask',
      },
    ],
  },
];
