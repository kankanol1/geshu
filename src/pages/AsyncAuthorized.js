import React from 'react';
import { connect } from 'dva';
import RenderAuthorized from '@/components/Authorized';
import Redirect from 'umi/redirect';
import PageLoading from '@/components/PageLoading';

class AsyncAuthorized extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/queryCurrentUser',
    });
  }

  renderLayout() {
    const { children, currentUser } = this.props;
    // get authority directly.
    const authorities = currentUser.currentAuthority;
    const Authorized = RenderAuthorized(authorities);
    return (
      <Authorized
        authority={children.props.route.authority}
        noMatch={<Redirect to="/user/login" />}
      >
        {children}
      </Authorized>
    );
  }

  render() {
    const { loadingUser } = this.props;
    return loadingUser ? <PageLoading /> : this.renderLayout();
  }
}

export default connect(({ global, setting }) => ({
  loadingUser: global.loadingUser,
  currentUser: global.currentUser,
  ...setting,
}))(AsyncAuthorized);
