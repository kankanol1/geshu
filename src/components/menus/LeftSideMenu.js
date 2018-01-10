import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';

const { SubMenu } = Menu;
const { Sider } = Layout;

const LeftSideMenu = ({dispatch, collapsed}) => {

    function handleCollapse(){
        dispatch({
            type: 'left_side_menu/collapse'
        })
    }
    
    return (
        <Sider  
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={180} style={{ background: '#fff', height: '100%' }}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
        <Menu.Item key="1" collapsedWidth={40}>
            <Icon type="pie-chart" />
            <span>数据总览</span>
        </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="file" /><span>共有数据库</span></span>}>
            <Menu.Item key="1">图数据库</Menu.Item>
            <Menu.Item key="2">基础数据库</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="file-ppt" /><span>私有数据库</span></span>}>
            <Menu.Item key="5">图数据库</Menu.Item>
            <Menu.Item key="6">基础数据库</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="file-add" /><span>新建</span></span>}>
            <Menu.Item key="9">图数据库</Menu.Item>
            <Menu.Item key="10">基础数据库</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    )
}

LeftSideMenu.propTypes = {
    collapsed: PropTypes.bool
}

export default connect(({left_side_menu}) => left_side_menu) (LeftSideMenu);