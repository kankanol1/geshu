import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from '../../utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const WorkspaceLayout = routerData['/project/workspace'].component;
  const UsersListLayout = routerData['/users/list'].component;
  const GraphLayout = routerData['/graph'].component;
  // const DatabaseLayout = routerData['/database'].component;

  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/user"
            component={UserLayout}
          />
          <AuthorizedRoute
            path="/project/workspace"
            render={props => <WorkspaceLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />
          <AuthorizedRoute
            path="/storage/dbquery"
            render={props => <WorkspaceLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />
          {/* <AuthorizedRoute
          path="/database"
          render={props => <DatabaseLayout {...props} />}
          authority={['admin', 'user']}
          redirectPath="/user/login"
          /> */}
          <AuthorizedRoute
            path="/graph"
            render={props => <GraphLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />
          <AuthorizedRoute
            path="/users/list"
            render={props => <UsersListLayout {...props} />}
            authority={['admin']}
            redirectPath="/user/login"
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />

        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
