import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import { Layout, Menu, Icon } from 'antd';
import SiderComponentList from './SiderComponentList';
import WorkCanvas from './WorkCanvas/WorkCanvas';
import ComponentSettings from './ComponentSettings';
import WorkAreaMenu from './WorkAreaMenu';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { Sider, Content } = Layout;

let i =0;

function gen() {
  return i++;
}


class WorkArea extends React.PureComponent {


    constructor(props) {
        super(props)
        this.handleItemDragged = this.handleItemDragged.bind(this)
        this.handleItemDragged2 = this.handleItemDragged2.bind(this)
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
            type: 'work_canvas/newComponent',
            component: {
              id:'generated-' + gen(),
              name: 'generated',
              x: dragClientTarget.x - x,
              y: dragClientTarget.y - y,
              width: 100,
              height: 40,
              points: [
                  /*input circles*/
                  {
                      id:'i-1',
                      label: 'a',
                      hint: 'b', // occurs when hover
                      x: 3,
                      y: 0.5,
                      type: 'datasource-input',
                      metatype: 'input',
                      connects: ['output']
                  },
                  {
                    id:'o-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 1,
                    y: 0.5,
                    type: 'datasource-output',
                    metatype: 'output',
                    connects: ['input']
                }
              ],
              connect_to: []
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
            type: 'work_canvas/newComponent',
            component: {
              id:'generated-' + gen(),
              name: 'generated',
              x: dragClientTarget.x - x,
              y: dragClientTarget.y - y,
              width: 100,
              height: 40,
              points: [
                  /*input circles*/
                  {
                      id:'i-1',
                      label: 'a',
                      hint: 'b', // occurs when hover
                      x: 3,
                      y: 0.3,
                      type: 'datasource-input',
                      metatype: 'input',
                      connects: ['datasource-output']
                  },
                  {
                      id:'i-2',
                      label: 'a',
                      hint: 'b', // occurs when hover
                      x: 3,
                      y: 0.7,
                      type: 'datasource-input',
                      metatype: 'input',
                      connects: ['datasource-output']
                  },
                  {
                    id:'o-1',
                    label: 'a',
                    hint: 'b', // occurs when hover
                    x: 1,
                    y: 0.5,
                    type: 'datasource-output',
                    metatype: 'output',
                    connects: ['datasource-input']
                }
              ],
              connect_to: []
          }
          })
        }
      }
      

    render() {
        return <React.Fragment>
                <SiderComponentList onItemDragged={this.handleItemDragged} onItemDragged2={this.handleItemDragged2}/>
                <Content style={{ background: '#fff', padding: 0, margin: 0, height: '100%', width: '100%'}}>
                    <WorkAreaMenu/>
                    
                    <WorkCanvas ref={e=> {this.canvasRef = e; console.log(this.canvasRef)}} style={{height:'calc(100%-46px)'}}/>
                    
                </Content>
                <ComponentSettings/>
            </React.Fragment>
    }
}

export default connect()(WorkArea);