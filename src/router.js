import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import DevCenter from './routes/DevCenter';
import LeftSideMenu from './components/menus/LeftSideMenu';
import RouteWithSubRoutes from './routes/RouteWithSubRoutes';

const routes = [
  { path: '/',
    component: IndexPage,
    routes: [
      {path: '/dataview', component: LeftSideMenu}
    ]
  }
]

function RouterConfig({ history }) {
  return (
    <Router history={history}>
    <div style={{height: '100%'}}>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route}/>
      ))}
      </div>
    </Router>
  );
}

export default RouterConfig;
