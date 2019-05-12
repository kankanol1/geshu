import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Card, Row, Col, Tag } from 'antd';
import MarkdownLoader from '@/components/MarkdownLoader';
import XLoading from '@/components/XLoading';

import styles from './Index.less';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  countLoading: loading.effects['dataproProject/fetchProjectCount'],
  readmeLoading: loading.effects['dataproProject/fetchProjectReadme'],
}))
class Index extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProjectCount',
      payload: { id },
    });
    dispatch({
      type: 'dataproProject/fetchProjectReadme',
      payload: { id },
    });
  }

  renderOverviewCard = id => {
    const { counts } = this.props.dataproProject;
    const { countLoading } = this.props;
    return (
      <Card title="概览">
        {countLoading ? (
          <XLoading />
        ) : (
          <Row span={24}>
            <Col span={6} className={styles.overviewItem}>
              <Link to={`/projects/p/pipeline/${id}`} className={styles.overviewLink}>
                <div>
                  <Icon
                    className={counts.pipeline > 0 ? styles.iconOrange : styles.iconGrey}
                    type="share-alt"
                  />
                  <span>
                    流程组件
                    <strong className={counts.pipeline > 0 ? styles.iconOrange : styles.iconGrey}>
                      {counts.pipeline}
                    </strong>
                    个
                  </span>
                </div>
              </Link>
            </Col>
            <Col span={6} className={styles.overviewItem}>
              <Link to={`/projects/p/dataset/${id}`} className={styles.overviewLink}>
                <div>
                  <Icon
                    className={counts.dataset > 0 ? styles.iconGreen : styles.iconGrey}
                    type="file-text"
                  />
                  <span>
                    数据集
                    <strong className={counts.dataset > 0 ? styles.iconGreen : styles.iconGrey}>
                      {counts.dataset}
                    </strong>
                    个
                  </span>
                </div>
              </Link>
            </Col>
            <Col span={6} className={styles.overviewItem}>
              <Link to={`/projects/p/files/${id}`} className={styles.overviewLink}>
                <div>
                  <Icon
                    className={counts.files > 0 ? styles.iconBlue : styles.iconGrey}
                    type="fund"
                  />
                  <span>
                    项目文件
                    <strong className={counts.files > 0 ? styles.iconBlue : styles.iconGrey}>
                      {counts.files}
                    </strong>
                    个
                  </span>
                </div>
              </Link>
            </Col>
            <Col span={6} className={styles.overviewItem}>
              <Link to={`/projects/p/versions/${id}`} className={styles.overviewLink}>
                <div>
                  <Icon
                    className={counts.commit > 0 ? styles.iconRed : styles.iconGrey}
                    type="clock-circle"
                  />
                  <span>
                    改动历史
                    <strong className={counts.commit > 0 ? styles.iconRed : styles.iconGrey}>
                      {counts.commit}
                    </strong>
                    次
                  </span>
                </div>
              </Link>
            </Col>
          </Row>
        )}
      </Card>
    );
  };

  render() {
    const { id } = this.props.match.params;
    const { readmeLoading } = this.props;
    const { readme } = this.props.dataproProject;
    return (
      <React.Fragment>
        {this.renderOverviewCard(id)}
        <br />
        <Card title="项目说明">
          {readmeLoading ? (
            <XLoading />
          ) : readme ? (
            <MarkdownLoader markdown={readme} />
          ) : (
            <span style={{ color: 'grey' }}>暂无项目说明</span>
          )}
        </Card>
      </React.Fragment>
    );
  }
}

export default Index;
