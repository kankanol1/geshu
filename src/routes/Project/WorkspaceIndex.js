import React, { Component } from 'react';
import { Layout, Card, Button, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './WorkspaceIndex.less';

const { Header } = Layout;

@connect(({ project, loading }) => ({
  project,
  loading: loading.models.project,
}))
export default class WorkspaceEditor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchRecentProjects',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/unloadRecentProjects',
    });
  }

  render() {
    const { recentProjects } = this.props.project;
    const loading = this.props.loading || recentProjects.loading;
    return (
      <Layout className={styles.contentLayout} theme="light" >
        <Card title="工作区项目" className={styles.firstCard}>
          {
            loading ? <Spin /> :
            recentProjects.data.map(item =>
              (
                <p key={item.id}>
                  <Link to={`/project/workspace/editor/${item.id}`} className={styles.clickableItem}>
                    <Icon type="file" /> {item.name} (最后编辑于 {moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')})
                  </Link>
                </p>
              )
            )
          }
          <Divider />
          <Button type="primary" className={styles.button}> <Icon type="folder-add" />新建项目</Button>
          <Button className={styles.button}> <Icon type="folder-open" />打开项目</Button>
        </Card>
      </Layout>
    );
  }
}
