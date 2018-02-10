import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Layout } from 'antd';
import SiderComponentList from './SiderComponentList';
import WorkCanvas from './WorkCanvas/WorkCanvas';
import ComponentSettings from './ComponentSettings';
import WorkAreaMenu from './WorkAreaMenu';

const { Content } = Layout;

let i = 0;

function gen() {
  return i++;
}


class WorkArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleItemDragged = this.handleItemDragged.bind(this);
  }


  handleItemDragged(dragTarget, dragClientTarget, component) {
    const { x, y, width, height } = ReactDOM.findDOMNode(this.canvasRef).getBoundingClientRect();
    if (dragClientTarget.x > x && dragClientTarget.y > y &&
      dragClientTarget.x < width + x && dragClientTarget.y < height + y) {
      // add new component.
      this.props.dispatch({
        type: 'work_canvas/newComponent',
        component: {
          id: `generated-${component.name}${gen()}`,
          ...component,
          x: dragClientTarget.x - x,
          y: dragClientTarget.y - y,
          connect_to: [],
        },
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <SiderComponentList onItemDragged={this.handleItemDragged} />
        <Content style={{ background: '#fff', padding: 0, margin: 0, height: '100%', width: '100%' }}>
          <WorkAreaMenu />

          <WorkCanvas ref={(e) => { this.canvasRef = e; }} style={{ height: 'calc(100%-46px)' }} />

        </Content>
        <ComponentSettings />
      </React.Fragment>
    );
  }
}

export default connect()(WorkArea);
