import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Card, Row, Col, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import XTopBar from '@/components/XTopBar';
import PageLoading from '@/components/PageLoading';
import XTagList from '@/components/XTagList';

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

  renderOverviewCard = () => {
    return (
      <Card title="概览">
        <Row span={24}>
          <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconOrange} type="share-alt" />
            <span>
              {' '}
              流程组件 <span>5</span> 个
            </span>
          </Col>
          <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconGreen} type="file-text" />
            <span>
              {' '}
              数据集 <span>5</span> 个
            </span>
          </Col>
          <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconBlue} type="fund" />
            <span>
              {' '}
              数据看板 <span>5</span> 个
            </span>
          </Col>
          <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconRed} type="clock-circle" />
            <span>
              {' '}
              改动历史 <span>5</span> 个
            </span>
          </Col>
          <Col span={4} className={styles.overviewItem}>
            <Icon className={styles.iconPurple} type="save" />
            <span>
              {' '}
              最后更新 <span>2018-09-08</span>{' '}
            </span>
          </Col>
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
        top={
          <XTopBar
            title={project.name}
            back="/projects/list"
            location={pathname}
            menus={[
              {
                tooltip: '概览',
                key: 'overview',
                link: `/projects/show/${id}`,
                content: <Icon type="profile" />,
              },
              {
                tooltip: '数据处理流程',
                key: 'pipeline',
                link: `/projects/pipeline/${id}`,
                content: <Icon type="share-alt" />,
              },
              {
                tooltip: '数据集',
                key: 'dataset',
                link: `/projects/dataset/${id}`,
                content: <Icon type="file-text" />,
              },
              {
                tooltip: '看板',
                key: 'dashboard',
                link: `/projects/dashboard/${id}`,
                content: <Icon type="fund" />,
              },
              {
                tooltip: '历史版本',
                key: 'versions',
                link: `/projects/versions/${id}`,
                content: <Icon type="clock-circle" />,
              },
              {
                tooltip: '项目设置',
                key: 'settings',
                link: `/projects/settings/${id}`,
                content: <Icon type="setting" />,
              },
            ]}
          />
        }
      >
        {this.renderOverviewCard()}
        <Card title="项目说明"> README.md </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectIndex;
