import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
import AbstractBasicLayout from './AbstractBasicLayout';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import NotFound from '../routes/Exception/404';
import { getFromRegistory } from '../common/registry';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;
const getMenuData = getFromRegistory('menuData');

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

class WorkspaceLayout extends AbstractBasicLayout {
  getContent() {
    const { routerData, match, fullScreen } = this.props;
    return (
      <Content style={{ height: '100%', overflowX: 'initial' }}>
        <div style={{ height: fullScreen ? '100vh' : 'calc(100vh - 64px)' }}>
          <Switch>
            {
              redirectData.map(item =>
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              )
            }
            {
              getRoutes(match.path, routerData).map(item =>
                (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                )
              )
            }
            {
              // default redirect to editor.
            }
            <Redirect exact from="/project/workspace" to="/project/workspace/index" />
            <Route render={NotFound} />
          </Switch>
        </div>
      </Content>);
  }
}

export default connect(({ global, loading }) => ({
  currentUser: global.currentUser,
  loading,
  collapsed: global.collapsed,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  // notices: global.notices,
  fullScreen: global.fullScreen,
}))(WorkspaceLayout);
