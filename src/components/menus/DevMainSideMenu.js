import PropTypes from 'prop-types';
import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import SearchableTree from '../devcenter/SearchableTree';
import DrageableTest from '../devcenter/DrageableTest';
import WorkCanvas from '../devcenter/WorkCanvas';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

@DragDropContext(HTML5Backend)
class DevMainSideMenu extends React.Component {

  constructor({dispatch, collapsed}){
    super();
    this.dispatch = dispatch;
    this.collapsed = collapsed;
  }

    handleCollapse = () => {
        this.dispatch({
            type: 'left_side_menu/collapse'
        })
    }
    
    render(){
    return (
      <Layout style={{height: '100%'}}>
        <Sider  
        collapsedWidth={80}
        collapsible
        collapsed={this.collapsed}
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
          <DrageableTest/>
        </Sider>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <WorkCanvas/>
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