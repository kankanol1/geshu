import PropTypes from 'prop-types';
import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import SearchableTree from '../devcenter/SearchableTree';
import DraggableTest from '../devcenter/DraggableTest';
import DagCanvas from '../devcenter/DagCanvas';
import { DragDropContext } from 'react-dnd'
import MouseBackEnd from 'react-dnd-mouse-backend'
import ContainerCanvas from '../devcenter/ContainerCanvas';
import DraggableItem from '../devcenter/DraggableItem';
import DraggableWithPreview from '../devcenter/DraggableWithPreview';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

@DragDropContext(MouseBackEnd)
class DevMainSideMenu extends React.Component {

    handleCollapse = () => {
        this.props.dispatch({
            type: 'left_side_menu/collapse'
        })
    }
    
    render(){
      let container = <ContainerCanvas/>;
    return (
      <Layout style={{height: '100%'}}>
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
          <DraggableWithPreview dragTraget={container}>
              <div>Hi, Drag me</div>
          </DraggableWithPreview>
        </Sider>
        <Content style={{ background: '#fff', padding: 0, margin: 0, height: '100%', width: '100%'}}>
          {container}
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