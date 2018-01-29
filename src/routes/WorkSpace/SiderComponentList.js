import React from 'react';
import DraggableWithPreview from '../../components/devcenter/DraggableWithPreview';
import { Layout, Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const { Sider } = Layout;
const Panel = Collapse.Panel;

class SiderComponentList extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            preview: null
        }
        this.handlePreviewChange = this.handlePreviewChange.bind(this)
    }

    handlePreviewChange(preview) {
        console.log('handle preview change')
        this.setState({
            preview: preview
        })
    }

    onChange(key) {
        console.log(key);
    }

    render() {
        return <Sider style={{background: 'transparent', height: '100%'}}>
        <Scrollbars>
        <Collapse defaultActiveKey={['1','2','3','4','5','6','7','8','9','10','11','12']} onChange={this.onChange} >
            <Panel header="Source Operator" key="1">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} onPreviewChanged={this.handlePreviewChange} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="2" >
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="3">
            <p>Needs to be added.</p>
            </Panel>
            <Panel header="Source Operator" key="4">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="5">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="6">
            <p>Needs to be added.</p>
            </Panel>
            <Panel header="Source Operator" key="7">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="8">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="9">
            <p>Needs to be added.</p>
            </Panel>
            
            <Panel header="Source Operator" key="10">
            <DraggableWithPreview onItemDragged={this.props.onItemDragged} preview={<div style={{width:'100px', 
                background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is preview</div>}>
             <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
            </Panel>
            <Panel header="Transform Operator" key="11">
            
                <DraggableWithPreview onItemDragged={this.props.onItemDragged2} preview={<div style={{width:'100px', 
                    background: '#999', height: '40px', cursor: 'move'}} onPreviewChanged={this.handlePreviewChange}>This is another preview</div>}>
                <div style={{cursor: 'move'}}>Test Different shape</div>
                </DraggableWithPreview>
            </Panel>
            <Panel header="Sink Operator" key="12">
            <p>Needs to be added.</p>
            </Panel>
        </Collapse>
        
        </Scrollbars>
            {this.state.preview}
      </Sider>
    }
}

export default SiderComponentList;