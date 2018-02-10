import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
import AbstractBasicLayout from './AbstractBasicLayout';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import NotFound from '../routes/Exception/404';
import { getMenuData } from '../common/menu';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

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
    const { routerData, match } = this.props;
    return (
      <Content style={{ height: '100%' }}>
        <div style={{ height: 'calc(100vh - 64px)' }}>
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
            <Redirect exact from="/project/workspace" to="/project/workspace/editor" />
            <Route render={NotFound} />
          </Switch>
        </div>
      </Content>);
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(WorkspaceLayout);
