import React from 'react';
import classNames from 'classnames';
import { Layout, Icon, Menu, Avatar, Dropdown, Spin } from 'antd';
import Link from 'umi/link';
import Identicon from 'identicon.js';
import hash from 'object-hash';
import BaseMenu from '../SiderMenu/BaseMenu';
import SuperSiderMenu from '../SiderMenu/SiderMenu';
import styles from './index.less';

const { Sider } = Layout;

export default class SiderMenu extends SuperSiderMenu {
  render() {
    const {
      logo,
      collapsed,
      onCollapse,
      fixSiderbar,
      theme,
      title,
      currentUser,
      onUserMenuClick,
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });

    const userMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onUserMenuClick}>
        <Menu.Item key="self">
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );

    const { avatar, userName } = currentUser;
    let displayAvatar = null;
    if (avatar !== undefined) {
      displayAvatar = avatar;
    } else if (userName !== undefined) {
      const imgData = new Identicon(hash(userName), 32).toString();
      displayAvatar = `data:image/png;base64,${imgData}`;
    }

    return (
      <Sider
        // trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={192}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{title}</h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%', overflowX: 'hidden' }}
          {...defaultProps}
        />

        <div className={styles.avatarWrapper}>
          {currentUser.userName ? (
            <Dropdown
              trigger="click"
              className={styles.dropdown}
              overlay={userMenu}
              placement="topRight"
            >
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="normal" className={styles.avatar} src={displayAvatar} />
                {collapsed ? null : <span className={styles.name}>{currentUser.userName}</span>}
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </Sider>
    );
  }
}
