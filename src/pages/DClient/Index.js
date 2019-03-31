import React from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './Index.less';

@connect()
class Index extends React.PureComponent {
  handleLogout() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  }

  render() {
    return (
      <div className={styles.itemWrapper}>
        <Link to="/tasks/t/new">
          <div className={`${styles.item} ${styles.color1}`}>
            <div className={styles.itemContent}>
              <Icon type="plus" />
              创建任务
            </div>
          </div>
        </Link>
        <Link to="/tasks">
          <div className={`${styles.item} ${styles.color2}`}>
            <div className={styles.itemContent}>
              <Icon type="table" />
              任务列表
            </div>
          </div>
        </Link>
        <Link to="/files">
          <div className={`${styles.item} ${styles.color3}`}>
            <div className={styles.itemContent}>
              <Icon type="hdd" />
              查看文件
            </div>
          </div>
        </Link>
        <div className={`${styles.item} ${styles.color4}`} onClick={() => this.handleLogout()}>
          <div className={styles.itemContent}>
            <Icon type="logout" />
            退出
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
