import React from 'react';
import DraggableWithPreview from '../../components/devcenter/DraggableWithPreview';
import { Layout, Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const { Sider } = Layout;
const Panel = Collapse.Panel;

class SiderComponentList extends React.PureComponent {

    onChange(key) {
        console.log(key);
      }

      renderTrackHorizontal(){
          console.log('')
          return null;
      }

    render() {
        return <Sider style={{background: 'transparent', height: '100%'}}>
        <Scrollbars style={{overflowX:'hidden'}}
        
        renderTrackHorizontal={this.renderTrackHorizontal}
        >
        <Collapse defaultActiveKey={['1']} onChange={this.onChange} style={{overflowX:'hidden'}}>
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
            <Panel header="Source Operator" key="4">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="5">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="6">
            <p>Needs to be added.</p>
            </Panel>
            <Panel header="Source Operator" key="7">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="8">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="9">
            <p>Needs to be added.</p>
            </Panel>
        </Collapse>
        
        </Scrollbars>
      </Sider>
    }
}

export default SiderComponentList;