import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'dva/router';
import AbstractBasicLayout from './AbstractBasicLayout';

class BasicLayout extends AbstractBasicLayout {
  getCustomRedirect = () => {
    return (
      <Redirect exact from="/users/list" to="/users/list/index" />
    );
  }
}

export default connect(({ global, loading }) => ({
  currentUser: global.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
