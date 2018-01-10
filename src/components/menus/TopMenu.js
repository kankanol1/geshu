import { Layout, Menu, Icon} from 'antd';
import styles from './TopMenu.less'

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
            <Menu.Item key="overview"><Icon type="table" />数据概览</Menu.Item>
            <Menu.Item key="workspace"><Icon type="codepen" />开发中心</Menu.Item>
            <Menu.Item key="jobs"><Icon type="profile" />作业管理</Menu.Item>
            <Menu.Item key="users"><Icon type="contacts" />用户管理</Menu.Item>
            </Menu>
        </Header>
    );
}

TopMenu.propTypes = {  
};

export default TopMenu;