// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const setupProxy = () => {
  let proxy = {};
  if (process.env.PROXY) {
    proxy = {
      ...proxy,
      '/api': {
        target: process.env.PROXY,
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/api': '' },
      },
    };
  }
  if (process.env.WSPROXY) {
    proxy = {
      ...proxy,
      '/ws': {
        target: process.env.WSPROXY,
        pathRewrite: { '^/ws': '' },
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
    };
  } else {
    proxy = {
      ...proxy,
      '/ws': {
        target: `ws://localhost:${getWSPort()}/`,
        pathRewrite: { '^/ws': '' },
        ws: true,
        secure: false,
        logLevel: 'debug',
      },
    };
  }
  return proxy;
};

const getWSPort = () => process.env.WSPORT || 8001;

export default {
  // add for transfer to umi
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: false, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true,
          // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
        // ...(!process.env.TEST && os.platform() === 'darwin'
        //   ? {
        //       dll: {
        //         include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        //         exclude: ['@babel/runtime'],
        //       },
        //       hardSource: false,
        //     }
        //   : {}),
      },
    ],
    // ['./config/plugins/global-hook.js', {}],
    ['./config/plugins/websocket-mock.js', { port: getWSPort() }],
  ],
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '2px',
    // 'font-size-base': '13px',
  },
  externals: {
    // '@antv/data-set': 'DataSet',
    // 'jquery': 'JQuery',
  },
  proxy: setupProxy(),
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    name: 'ant-design-pro',
    background_color: '#FFF',
    description: 'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },

  chainWebpack: webpackPlugin,
  // devServer: {
  //   headers: { "Access-Control-Allow-Origin": "*" },
  // },
  cssnano: {
    mergeRules: false,
  },
  history: 'hash',

  context: {
    // for loading different public scripts .
    _env: defaultSettings._env,
  },
};
