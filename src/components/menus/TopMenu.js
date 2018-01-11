import { Layout, Menu, Icon} from 'antd';
import styles from './TopMenu.less'
import {Link} from 'dva/router'

const { Header} = Layout;

const TopMenu = () => {
    return (
        <Header className={styles.header}>
            <div className={styles.logo}> LOGO </div>
            <Menu
            className={styles.menuTop}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['overview']}
            >
            <Menu.Item key="overview"><Link to="/dataview"><Icon type="table" />数据概览</Link></Menu.Item>
            <Menu.Item key="workspace"><Link to="/devcenter"><Icon type="codepen" />开发中心</Link></Menu.Item>
            <Menu.Item key="jobs"><Icon type="profile" />作业管理</Menu.Item>
            <Menu.Item key="users"><Icon type="contacts" />用户管理</Menu.Item>
            </Menu>
        </Header>
    );
}

TopMenu.propTypes = {  
};

export default TopMenu;