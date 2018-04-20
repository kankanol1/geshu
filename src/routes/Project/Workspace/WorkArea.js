import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Layout, Button, Spin } from 'antd';
import { saveSvgAsPng } from 'save-svg-as-png';
import SiderComponentList from './SiderComponentList';
import WorkCanvas from './WorkCanvas/WorkCanvas';
import ComponentSettings from './ComponentSettings';
import WorkAreaBottomBar from './WorkAreaBottomBar';
import TopComponentList from './TopComponentList';

const { Content } = Layout;

let i = Date.now();

function gen() {
  return i++;
}


@connect(({ work_canvas, loading }) => (
  {
    work_canvas,
    loading,
  }))
export default class WorkArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleItemDragged = this.handleItemDragged.bind(this);
    // this.exportSvg = this.exportSvg.bind(this);
  }


  handleItemDragged(dragTarget, dragClientTarget, component) {
    const { x, y, width, height } = ReactDOM.findDOMNode(this.canvasRef).getBoundingClientRect();
    if (dragClientTarget.x > x && dragClientTarget.y > y &&
      dragClientTarget.x < width + x && dragClientTarget.y < height + y) {
      // add new component.
      this.props.dispatch({
        type: 'work_canvas/newComponent',
        component: {
          id: `${component.name}${gen()}`,
          ...component,
          x: (dragClientTarget.x - x) + 10,
          // plus margin in the preview.
          y: (dragClientTarget.y - y - component.height) + 10,
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
    const isLoading = this.props.loading.effects['work_canvas/init'];
    return (
      <React.Fragment>
        {/* <Button onClick={this.exportSvg}> export </Button> */}
        {/* <SiderComponentList onItemDragged={this.handleItemDragged} /> */}
        <TopComponentList onItemDragged={this.handleItemDragged} />
        <Content style={{ background: '#fff', padding: 0, margin: 0, width: '100%', display: 'flex', flexDirection: 'row' }}>
          <WorkCanvas ref={(e) => { this.canvasRef = e; }} match={this.props.match} />
          {
            isLoading ?
              <Spin size="large" style={{ zIndex: '200', width: '100%', margin: 'auto', paddingTop: '200px', position: 'absolute', left: '0' }} />
            : null
          }
          <WorkAreaBottomBar />
          <ComponentSettings match={this.props.match} />
        </Content>
      </React.Fragment>
    );
  }
}
