import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames/bind';
import styles from './index.less';

export default class FloatDrawerTrigger extends React.Component {
  render() {
    const { position, open, toggle, style } = this.props;
    let iconType;
    const cx = classNames.bind(styles);
    if (position === 'left') {
      iconType = open ? 'left' : 'right';
    } else if (position === 'right') {
      iconType = open ? 'right' : 'left';
    } else if (position === 'top') {
      iconType = open ? 'down' : 'up';
    } else {
      iconType = open ? 'up' : 'down';
    }
    return (
      <div className={cx('toggleTrigger', `toggleTrigger-${position}`)} style={style} >
        <Icon type={iconType} onClick={() => toggle(!open)} />
      </div>
    );
  }
}
