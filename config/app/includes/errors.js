export default [
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
];
