import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom'
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import SearchableTree from '../devcenter/SearchableTree';
import DraggableTest from '../devcenter/DraggableTest';
import DagCanvas from '../devcenter/DagCanvas';
import { DragDropContext } from 'react-dnd'
import ContainerCanvas from '../devcenter/ContainerCanvas';
import DraggableItem from '../devcenter/DraggableItem';
import DraggableWithPreview from '../devcenter/DraggableWithPreview';
import HTML5Backend from 'react-dnd-html5-backend'
import ComponentItem from '../devcenter/ComponentItem';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

let i =0;

function gen() {
  return i++;
}

@DragDropContext(HTML5Backend)
class DevMainSideMenu extends React.Component {

  constructor(props) {
    super(props)
    this.handleItemDragged = this.handleItemDragged.bind(this)
    this.handleItemDragged2 = this.handleItemDragged2.bind(this)
  }

    handleCollapse = () => {
        this.props.dispatch({
            type: 'left_side_menu/collapse'
        })
    }


    handleItemDragged(dragTarget, dragClientTarget) {
      const {x, y, width, height} = ReactDOM.findDOMNode(this.canvasRef).getBoundingClientRect()
      console.log("dragTarget", dragClientTarget)
      console.log("rect range", x, y, width, height)
      if (dragClientTarget.x > x && dragClientTarget.y > y && 
        dragClientTarget.x < width +x && dragClientTarget.y < height + y) {
        console.log("yahaha" )
        // add new component.
        this.props.dispatch({
          type: 'container_canvas/newComponent',
          component: {
            id:'generated-' + gen(),
            x: dragClientTarget.x - x,
            y: dragClientTarget.y - y,
            width: 100,
            height: 40,
            inputs: [
                /*input circles*/
                {
                    id:'i-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 3,
                    y: 0.5,
                }
            ],
            outputs: [
                /*output circles */
                {
                    id:'o-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 1,
                    y: 0.5,
                }
            ],
            connect_to: [],
            connected_from: []
        }
        })
      }
    }

    handleItemDragged2(dragTarget, dragClientTarget) {
      const {x, y, width, height} = ReactDOM.findDOMNode(this.canvasRef).getBoundingClientRect()
      console.log("dragTarget", dragClientTarget)
      console.log("rect range", x, y, width, height)
      if (dragClientTarget.x > x && dragClientTarget.y > y && 
        dragClientTarget.x < width +x && dragClientTarget.y < height + y) {
        console.log("yahaha" )
        // add new component.
        this.props.dispatch({
          type: 'container_canvas/newComponent',
          component: {
            id:'generated-' + gen(),
            x: dragClientTarget.x - x,
            y: dragClientTarget.y - y,
            width: 100,
            height: 40,
            inputs: [
                /*input circles*/
                {
                    id:'i-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 3,
                    y: 0.3,
                },
                {
                    id:'i-2',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 3,
                    y: 0.7,
                }
            ],
            outputs: [
                /*output circles */
                {
                    id:'o-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 1,
                    y: 0.5,
                }
            ],
            connect_to: [],
            connected_from: []
        }
        })
      }
    }
    
    render(){
    return (
      <Layout style={{height: '100%'}} >
        <Sider  
        collapsedWidth={80}
        collapsible
        collapsed={this.props.collapsed}
        onCollapse={this.handleCollapse}
        width={180} style={{ background: '#fff', height: '100%' }}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
        <Menu.Item key="1" collapsedWidth={40}>
            <Icon type="calendar" />
            <span>首页</span>
        </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="form" /><span>项目管理</span></span>}>
            <Menu.Item key="1">xxx</Menu.Item>
            <Menu.Item key="2">xxx</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="api" /><span>模型管理</span></span>}>
            <Menu.Item key="5">xxx</Menu.Item>
            <Menu.Item key="6">xxx</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="file-add" /><span>新建</span></span>}>
            <Menu.Item key="9">xxx</Menu.Item>
            <Menu.Item key="10">xxx</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout style={{ padding: '0',  height: '100%' }} theme='light'>
        <Sider style={{background: 'transparent'}}>
          <DraggableWithPreview onItemDragged={this.handleItemDragged} preview={<div style={{width:'100px', 
              background: '#999', height: '40px', cursor: 'move'}}>This is preview</div>}>
            <div style={{cursor: 'move'}}>Test</div>
            </DraggableWithPreview>
          <DraggableWithPreview onItemDragged={this.handleItemDragged2} preview={<div style={{width:'100px', 
              background: '#999', height: '40px', cursor: 'move'}}>This is another preview</div>}>
            <div style={{cursor: 'move'}}>Test Different shape</div>
            </DraggableWithPreview>
        </Sider>
        <Content style={{ background: '#fff', padding: 0, margin: 0, height: '100%', width: '100%'}}>
          <ContainerCanvas ref={e=> {this.canvasRef = e; console.log(this.canvasRef)}}/>
        </Content>
      </Layout>
      
      </Layout>
    )
  }
}

DevMainSideMenu.propTypes = {
    collapsed: PropTypes.bool
}

export default connect(({left_side_menu}) => left_side_menu) (DevMainSideMenu);