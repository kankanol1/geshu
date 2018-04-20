import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames/bind';
import styles from './index.less';

export default class FloatDrawerTrigger extends React.Component {
  render() {
    const { position, status, open, toggle, style } = this.props;
    let iconType;
    const cx = classNames.bind(styles);
    if (position === 'left') {
      iconType = open ? 'double-left' : 'double-right';
    } else if (position === 'right') {
      iconType = open ? 'double-right' : 'double-left';
    }
    return (
      <div className={cx('toggleTrigger', `toggleTrigger-${position}`)} style={style} >
        <Icon type={iconType} onClick={() => toggle(!status)} />
      </div>
    );
  }
}
