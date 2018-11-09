import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Card, Row, Col, Tag } from 'antd';
import MarkdownLoader from '@/components/MarkdownLoader';

import styles from './Index.less';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Index extends PureComponent {
  renderOverviewCard = id => {
    return (
      <Card title="概览">
        <Row span={24}>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/pipeline/${id}`} className={styles.overviewLink}>
              <div>
                <Icon className={styles.iconOrange} type="share-alt" />
                <span>
                  流程组件 <strong className={styles.iconOrange}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/dataset/${id}`} className={styles.overviewLink}>
              <div>
                <Icon className={styles.iconGreen} type="file-text" />
                <span>
                  数据集 <strong className={styles.iconGreen}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/dashboard/${id}`} className={styles.overviewLink}>
              <div>
                <Icon className={styles.iconBlue} type="fund" />
                <span>
                  数据看板 <strong className={styles.iconBlue}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/versions/${id}`} className={styles.overviewLink}>
              <div>
                <Icon className={styles.iconRed} type="clock-circle" />
                <span>
                  改动历史 <strong className={styles.iconRed}>5</strong> 次
                </span>
              </div>
            </Link>
          </Col>
          {/* <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconPurple} type="save" />
            <span>
              {' '}
              最后更新 <span>2018-09-08</span>{' '}
            </span>
          </Col> */}
        </Row>
      </Card>
    );
  };

  render() {
    const { id } = this.props.match.params;
    return (
      <React.Fragment>
        {this.renderOverviewCard(id)}
        <br />
        <Card title="项目说明">
          <MarkdownLoader url="/doc/test.md" />
        </Card>
      </React.Fragment>
    );
  }
}

export default Index;
