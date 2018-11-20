import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Layout, Button, Spin } from 'antd';

import WorkCanvas from './WorkCanvas';
import styles from './Workspace.less';

const { Content } = Layout;

let i = Date.now();

function gen() {
  return i++;
}

@connect(({ dataproPipeline, loading }) => ({
  dataproPipeline,
  loading,
}))
class Workspace extends React.Component {
  componentDidMount() {
    // use timeout to ensure the div is already calculated correctly.
    // setTimeout(() => {
    //   const canvasDOM = ReactDOM.findDOMNode(this.canvasContent);
    //   // if the user already switched pages.
    //   if (!canvasDOM) return;
    //   const { x, y } = canvasDOM.getBoundingClientRect();
    //   this.props.dispatch({
    //     type: 'workcanvas/contextMenuOffsetInit',
    //     payload: {
    //       offsetX: x,
    //       offsetY: y,
    //     },
    //   });
    // }, 500);
  }

  render() {
    const isLoading = this.props.loading.effects['workcanvas/initProject'];
    return (
      <React.Fragment>
        <Content
          className={styles.workContent}
          ref={e => {
            this.canvasContent = e;
          }}
        >
          <WorkCanvas />
        </Content>
      </React.Fragment>
    );
  }
}

export default Workspace;
