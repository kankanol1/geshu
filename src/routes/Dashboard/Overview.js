import React, { PureComponent } from 'react';
import { Row, Col, Card, List, Avatar } from 'antd';

import styles from './Overview.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


export default class Overview extends PureComponent {
  render() {

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，Admin！好的开始是成功的一半</div>
          <div>机器学习专家</div>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Card>
          <Card.Meta
            title={(<div>Title </div>)}
          />
          <div>Overview content</div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
