export default [
  { path: '/projects', redirect: '/projects/list' },
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
        path: '/projects/create/:template?',
        name: 'create',
        hideInMenu: true,
        component: './DataPro/Projects/CreateProject',
      },
      {
        // all the sub-pages indices
        path: '/projects/p/:pane(show|pipeline|templates|dataset|files|versions|settings)/:id',
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
];
