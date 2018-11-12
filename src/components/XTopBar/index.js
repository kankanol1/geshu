import React, { PureComponent } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import Link from 'umi/link';

import styles from './index.less';

export default class XTopBar extends PureComponent {
  render() {
    const { title, leftMenus, rightMenus } = this.props;
    // menus: {selected: boolean, key:string, tooltip:string, content:recatComponent, link?: url, onClick?: function}
    const renderItem = item => {
      return (
        <Tooltip key={item.key} title={item.tooltip} placement="bottom">
          {item.link && (
            <Link to={item.link} className={item.selected ? styles.menuSelected : styles.menu}>
              {item.content}
            </Link>
          )}
          {!item.link && (
            <div
              onClick={item.onClick}
              className={item.selected ? styles.menuSelected : styles.menu}
            >
              {item.content}
            </div>
          )}
        </Tooltip>
      );
    };
    return (
      <div className={styles.topbar}>
        <div className={styles.leftMenuWrapper}>{leftMenus.map(item => renderItem(item))}</div>
        {title}
        <div className={styles.rightMenuWrapper}>{rightMenus.map(item => renderItem(item))}</div>
      </div>
    );
  }
}
