import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Card, Row, Col, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import XTagList from '@/components/XTagList';
import MarkdownLoader from '@/components/MarkdownLoader';

import { renderTopBar } from './Utils';

import styles from './ProjectIndex.less';

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class ProjectIndex extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'dataproProject/fetchProject',
      payload: { id },
    });
  }

  renderOverviewCard = id => {
    return (
      <Card title="概览">
        <Row span={24}>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/pipeline/${id}`} class={styles.overviewLink}>
              <div>
                <Icon className={styles.iconOrange} type="share-alt" />
                <span>
                  流程组件 <strong className={styles.iconOrange}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/dataset/${id}`} class={styles.overviewLink}>
              <div>
                <Icon className={styles.iconGreen} type="file-text" />
                <span>
                  数据集 <strong className={styles.iconGreen}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/dashboard/${id}`} class={styles.overviewLink}>
              <div>
                <Icon className={styles.iconBlue} type="fund" />
                <span>
                  数据看板 <strong className={styles.iconBlue}>5</strong> 个
                </span>
              </div>
            </Link>
          </Col>
          <Col span={6} className={styles.overviewItem}>
            <Link to={`/projects/versions/${id}`} class={styles.overviewLink}>
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
    const { loading } = this.props;
    const { pathname } = this.props.location;
    const { id } = this.props.match.params;

    if (loading) return <PageLoading />;
    const { project } = this.props.dataproProject;

    const content = (
      <div>
        <p>{project.description}</p>
        <XTagList editable tags={[{ color: 'volcano', name: 'label' }]} />
      </div>
    );

    return (
      <PageHeaderWrapper
        hiddenBreadcrumb
        title={project.name}
        content={content}
        top={renderTopBar(id, project.name, pathname)}
      >
        {this.renderOverviewCard(id)}
        <br />
        <Card title="项目说明">
          {' '}
          <MarkdownLoader url="/doc/test.md" />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectIndex;
