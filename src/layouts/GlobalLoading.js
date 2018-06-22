import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

@connect(({ global }) => ({
  global,
}))
export default class GlobalLoading extends React.Component {
  componentDidMount() {
    const { currentUser } = this.props.global;
    // fetch authority.
    if (currentUser === undefined ||
      Object.keys(currentUser).length === 0
    ) {
      this.props.dispatch({
        type: 'global/queryCurrentUser',
        callback: () => {
          if (this.props.onLoaded) {
            this.props.onLoaded();
          }
        },
      });
    } else if (this.props.onLoaded) {
      this.props.onLoaded();
    }
  }

  render() {
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
  }
}
