import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import store from './index';

@connect(({ global }) => ({
  global,
}))
export default class AuthoriedRouters extends React.Component {
  componentDidMount() {
    // fetch authority.
    this.props.dispatch({
      type: 'global/fetchUserRole',
    });
  }

  render() {
    if (!this.props.global || this.props.global.loadingRole) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>);
    } else {
      return this.props.routers();
    }
  }
}
