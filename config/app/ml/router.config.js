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
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/project/list' },
      { path: '/self', redirect: '/self/basic' },
      {
        path: '/project',
        name: 'project',
        icon: 'bulb',
        routes: [
          {
            path: '/project/list',
            name: 'list',
            component: './Project/ProjectList',
          },
          {
            // for pipeline workspace.
            path: '/project/workspace',
            name: 'workspace',
            redirect: '/project/workspace/index',
          },
          {
            path: '/project/workspace/index',
            component: './Project/Workspace/WorkspaceIndex',
          },
          {
            path: '/project/workspace/editor/:id',
            component: './Project/Workspace/WorkspaceEditor',
          },
          {
            path: '/project/workspace/output/:id',
            component: './Project/Workspace/WorkspaceOutputView',
          },
        ],
      },
      {
        path: '/models',
        icon: 'api',
        name: 'models',
        routes: [
          { path: '/models/list', name: 'list', component: './Model/ModelList' },
          {
            path: '/models/candidates',
            name: 'candidates',
            component: './Model/CandidateModelList',
          },
          { path: '/models/serving', name: 'serving', component: './Model/ServingModelList' },
          { path: '/models/serving/test/:id', component: './Model/ModelServingTest' },
        ],
      },
      {
        path: '/jobs',
        icon: 'schedule',
        name: 'jobs',
        routes: [{ path: '/jobs/list', name: 'list', component: './Job/JobList' }],
      },
      {
        path: '/storage',
        icon: 'database',
        name: 'storage',
        routes: [
          { path: 'filelist', name: 'filelist', component: './Storage/StorageList' },
          { path: 'dataset', name: 'dataset', redirect: '/storage/dataset/index' },
          { path: 'dataset/index', component: './Dataset/DatasetList' },
          { path: 'dataset/create', component: './Dataset/EditDataset' },
          { path: 'dataset/update/:id', component: './Dataset/EditDataset' },
          { path: 'dataset/show/:id', component: './Dataset/DatasetDetail' },
        ],
      },
      {
        path: 'users',
        name: 'users',
        icon: 'contacts',
        authority: ['admin'],
        routes: [
          { path: 'list', name: 'list', redirect: '/users/list/index' },
          { path: 'list/index', component: './Users/UserList' },
          { path: 'list/edit/:userName', component: './Users/UserEdit' },
          { path: 'create', name: 'create', component: './Users/UserEdit' },
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
