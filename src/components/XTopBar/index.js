import React, { PureComponent } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import Link from 'umi/link';

import styles from './index.less';

export default class XTopBar extends PureComponent {
  render() {
    const { back, title, menus, location } = this.props;
    // menus: {key:string, tooltip:string, content:recatComponent, link: url}
    return (
      <div className={styles.topbar}>
        {back ? (
          <Tooltip title="返回">
            <Link to={back} className={styles.home}>
              <Icon type="home" />
            </Link>
          </Tooltip>
        ) : null}
        {title}
        <div className={styles.menuWrapper}>
          {menus.map(item => (
            <Tooltip key={item.key} title={item.tooltip} placement="bottom">
              <Link
                to={item.link}
                className={item.link === location ? styles.menuSelected : styles.menu}
              >
                {item.content}
              </Link>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
}
