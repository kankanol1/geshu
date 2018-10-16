import React from 'react';
import ReactDOM from 'react-dom';
import { Prompt } from 'react-router-dom';
import { connect } from 'dva';
import { Layout, Button, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import WorkCanvas from '../WorkCanvas/WorkCanvas';
import ComponentSettings from './ComponentSettings';
import WorkAreaBottomBar from './WorkAreaBottomBar';
import TopComponentList from './TopComponentList';
import styles from './WorkArea.less';

const { Content } = Layout;

let i = Date.now();

function gen() {
  return i++;
}

@connect(({ workcanvas, loading }) => ({
  workcanvas,
  loading,
}))
class WorkArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemDragged = this.handleItemDragged.bind(this);
    // this.exportSvg = this.exportSvg.bind(this);
  }

  componentDidMount() {
    // use timeout to ensure the div is already calculated correctly.
    setTimeout(() => {
      const canvasDOM = ReactDOM.findDOMNode(this.canvasContent);
      // if the user already switched pages.
      if (!canvasDOM) return;
      const { x, y } = canvasDOM.getBoundingClientRect();
      this.props.dispatch({
        type: 'workcanvas/contextMenuOffsetInit',
        payload: {
          offsetX: x,
          offsetY: y,
        },
      });
    }, 500);
  }

  handleItemDragged(dragTarget, dragClientTarget, component) {
    const { x, y, width, height } = ReactDOM.findDOMNode(this.canvasRef).getBoundingClientRect();
    if (
      dragClientTarget.x > x &&
      dragClientTarget.y > y &&
      dragClientTarget.x < width + x &&
      dragClientTarget.y < height + y
    ) {
      // add new component.
      this.props.dispatch({
        type: 'workcanvas/canvasNewComponent',
        component: {
          id: `${component.name}${gen()}`,
          ...component,
          x: dragClientTarget.x - x + 10,
          // plus margin in the preview.
          y: dragClientTarget.y - y,
          // minus the height of the preview & plus margin in the preview.
          connectFrom: [],
        },
      });
    }
  }

  // exportSvg() {
  //   saveSvgAsPng(
  //     ReactDOM.findDOMNode(this.canvasRef).getElementsByClassName('work-canvas')[0],
  //     'diagram.png');
  // }

  render() {
    const isLoading = this.props.loading.effects['workcanvas/initProject'];
    return (
      <React.Fragment>
        {/* <Button onClick={this.exportSvg}> export </Button> */}
        {/* <SiderComponentList onItemDragged={this.handleItemDragged} /> */}
        <Content
          className={styles.workContent}
          ref={e => {
            this.canvasContent = e;
          }}
        >
          <TopComponentList onItemDragged={this.handleItemDragged} />
          <WorkCanvas
            ref={e => {
              this.canvasRef = e;
            }}
            match={this.props.match}
          />
          {isLoading ? (
            <Spin
              size="large"
              style={{
                zIndex: '200',
                width: '100%',
                margin: 'auto',
                paddingTop: '200px',
                position: 'absolute',
                left: '0',
              }}
            />
          ) : null}
          <WorkAreaBottomBar />
          <ComponentSettings match={this.props.match} />
        </Content>
        <Prompt
          when={this.props.workcanvas.state.dirty || false}
          message={location => '当前有未保存的改动，确认离开吗？'}
        />
      </React.Fragment>
    );
  }
}

export default WorkArea;
