import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.png';
import { getUrlParams, replaceUrlWithParams } from '../utils/conversionUtils';
import LoadedLayout from './LoadedLayout';

const { Content, Header, Footer } = Layout;
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

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class AbstractBasicLayout extends LoadedLayout {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'users/queryCurrentUser',
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'GAIA';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }

  getCustomRedirect = () => {
    return null;
  }

  getContent() {
    const { routerData, match } = this.props;
    const bashRedirect = this.getBashRedirect();
    return (
      <Content style={{ margin: '24px 24px 0', height: '100%' }}>
        <div style={{ minHeight: 'calc(100vh - 260px)' }}>
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
                    match={match}
                  />
                )
              )
            }
            <Redirect exact from="/" to={bashRedirect} />
            {
              // redirects.
            }
            <Redirect exact from="/models/serving" to="/models/serving/list" />
            {this.getCustomRedirect()}
            <Route render={NotFound} />
          </Switch>
        </div>
        <Footer style={{ padding: 0 }}>
          <GlobalFooter
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> 2018 GrandLand
              </Fragment>
            }
          />
        </Footer>
      </Content>);
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const url = window.location.href;
    const urlParams = getUrlParams(url);

    const { redirect } = urlParams;
    // Remove the parameters in the url
    if (redirect) {
      delete urlParams.redirect;
      const redirectPath = replaceUrlWithParams(url, urlParams);
      window.history.replaceState(null, 'redirect', redirectPath);
    } else {
      return '/project/list';
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  // handleNoticeClear = (type) => {
  //   message.success(`清空了${type}`);
  //   this.props.dispatch({
  //     type: 'global/clearNotices',
  //     payload: type,
  //   });
  // }
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
    if (key === 'self') {
      this.props.dispatch(routerRedux.push('/self'));
    }
  }
  // handleNoticeVisibleChange = (visible) => {
  //   if (visible) {
  //     this.props.dispatch({
  //       type: 'global/fetchNotices',
  //     });
  //   }
  // }
  renderLayout() {
    const {
      currentUser, collapsed, fetchingNotices, notices, location, fullScreen,
    } = this.props;
    const isFullScreen = fullScreen === undefined ? false : fullScreen;
    const layout = (
      <Layout>
        {isFullScreen ? null : (
          <SiderMenu
            logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={getMenuData()}
            collapsed={collapsed}
            location={location}
            isMobile={this.state.isMobile}
            onCollapse={this.handleMenuCollapse}
          />
        )}

        <Layout>
          {isFullScreen ? null : (
            <Header style={{ padding: 0 }}>
              <GlobalHeader
                logo={logo}
                currentUser={currentUser}
                fetchingNotices={fetchingNotices}
                notices={notices}
                collapsed={collapsed}
                isMobile={this.state.isMobile}
                onNoticeClear={this.handleNoticeClear}
                onCollapse={this.handleMenuCollapse}
                onMenuClick={this.handleMenuClick}
                onNoticeVisibleChange={this.handleNoticeVisibleChange}
              />
            </Header>
            )}

          {this.getContent()}
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default AbstractBasicLayout;

