import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip } from 'antd';
import hash from 'object-hash';
import Identicon from 'identicon.js';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    const { avatar, userName } = currentUser;
    let displayAvatar = null;
    if (avatar !== undefined) {
      displayAvatar = avatar;
    } else if (userName !== undefined) {
      const imgData = new Identicon(hash(userName), 32).toString();
      displayAvatar = `data:image/png;base64,${imgData}`;
    }
    return (
      <div className={className}>
        {currentUser.userName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="normal" className={styles.avatar} src={displayAvatar} />
              <span className={styles.name}>{currentUser.userName}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
