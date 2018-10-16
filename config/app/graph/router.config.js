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
      { path: '/', redirect: '/graph/list' },
      { path: '/self', redirect: '/self/basic' },
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
        path: '/graph',
        icon: 'share-alt',
        name: 'graph',
        routes: [
          { path: 'list', name: 'list', component: './Graph/GraphList' },
          { path: 'jobs', name: 'jobs', component: './Graph/GraphJobList' },
          { path: 'schema', name: 'schema', component: './Graph/GraphIndex' },
          { path: 'mapper', name: 'mapper', component: './Graph/GraphIndex' },
          { path: 'query', name: 'query', component: './Graph/GraphIndex' },
          { path: 'explore', name: 'explore', component: './Graph/GraphIndex' },

          // with ids
          { path: 'schema/detail/:id', component: './Graph/schema/SchemaDesigner' },
          { path: 'mapper/detail/:id', component: './Graph/mapping/MappingDesigner' },
          { path: 'query/detail/:id', component: './Graph/query/GraphQuery' },
          { path: 'explore/detail/:id', component: './Graph/explore/GraphExplore' },
          { path: 'mapper/not_create/:id', component: './Graph/schema/NotExecute' },
          { path: 'query/not_create/:id', component: './Graph/schema/NotExecute' },
          { path: 'explore/not_create/:id', component: './Graph/schema/NotExecute' },
          { path: 'query/not_create/:id', component: './Graph/schema/NotImportData' },
          { path: 'explore/not_create/:id', component: './Graph/schema/NotImportData' },
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
