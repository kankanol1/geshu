import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';

import styles from './index.less';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

export default class XTopBar extends PureComponent {
  render() {
    const { back, title } = this.props;
    return (
      <div className={styles.topbar}>
        {back ? (
          <Link to={back} className={styles.home}>
            {' '}
            <Icon type="left" />
          </Link>
        ) : null}
        {title}
        <div className={styles.menuWrapper}>
          <div className={styles.menuSelected}>Test</div>
          <div className={styles.menu}>
            <Icon type="setting" />
          </div>
        </div>
      </div>
    );
  }
}
