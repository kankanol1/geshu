import { connect } from 'dva';
import AbstractBasicLayout from './AbstractBasicLayout';

class BasicLayout extends AbstractBasicLayout {

}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
