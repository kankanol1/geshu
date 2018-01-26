import React from 'react';
import DraggableWithPreview from '../../components/devcenter/DraggableWithPreview';
import { Layout, Menu, Icon } from 'antd';

const { Sider, Content } = Layout;

class SiderComponentList extends React.PureComponent {

    render() {
        return <Sider style={{background: 'transparent'}}>
        <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
            background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
          <div style={{cursor: 'move'}}>Test</div>
          </DraggableWithPreview>
        <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
            background: '#999', height: '40px', cursor: 'move'}}>This is another preview</div>}>
          <div style={{cursor: 'move'}}>Test Different shape</div>
          </DraggableWithPreview>
      </Sider>
    }
}

export default SiderComponentList;