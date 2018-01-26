import React from 'react';
import DraggableWithPreview from '../../components/devcenter/DraggableWithPreview';
import { Layout, Collapse } from 'antd';

const { Sider } = Layout;
const Panel = Collapse.Panel;

class SiderComponentList extends React.PureComponent {

    onChange(key) {
        console.log(key);
      }

    render() {
        return <Sider style={{background: 'transparent'}}>
        <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
            <Panel header="Source Operator" key="1">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="2">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="3">
            <p>Needs to be added.</p>
            </Panel>
        </Collapse>
        
      </Sider>
    }
}

export default SiderComponentList;