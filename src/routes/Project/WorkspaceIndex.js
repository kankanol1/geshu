import React, { Component } from 'react';
import { Layout, Card, Button, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';
import styles from './WorkspaceIndex.less';

import CreateProjectForm from './CreateProjectForm';
import OpenProjectForm from './OpenProjectForm';

// const { Header } = Layout;it stat
@connect(({ project, loading }) => ({
  project,
  loading: loading.models.project,
}))
export default class WorkspaceEditor extends Component {
  state = {
    modalVisible: false,
    modalOpenVisible: false,
    openList: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchRecentProjects',
    });
    dispatch({
      type: 'project/fetchLabelsList',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/unloadRecentProjects',
    });
  }


  handleAdd = (fieldsValue) => {
    const { project: { data }, dispatch } = this.props;
    const labels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return data.labels[intL];
        }
        return l;
      });
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'project/createProject',
        payload: {
          ...fieldsValue,
          labels: labels && labels.join(),
          refreshParams: this.refreshParams,
        },
        resolve,
        reject,
      });
    }).then(() => { this.handleModalVisible(false); })
      .then(
        () =>
          dispatch(routerRedux.push('/project/workspace/editor/0'))
      );
  }

  handleSearch = (fieldsValue) => {
    const { project: { data }, dispatch } = this.props;
    const labels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return data.labels[intL];
        }
        return l;
      });

    dispatch({
      type: 'project/fetchProjectList',
      payload: {
        ...fieldsValue,
        labels: labels && labels.join(),
        refreshParams: this.refreshParams,
      },
    });
  }
  handleModalVisible = (visible) => {
    this.setState({ ...this.state,
      modalVisible: !!visible,
      currentRecord: undefined,
    });
  }

  handleOpenModalVisible= (visible) => {
    this.setState({ ...this.state,
      modalOpenVisible: !!visible,
      currentRecord: undefined,
      openList: [],
    });
  }

  render() {
    const { recentProjects, data: { labels }, data: { list } } = this.props.project;
    const loading = this.props.loading || recentProjects.loading;
    const parentMethods = {
      labels,
      handleAdd: this.handleAdd,
      handleSearch: this.handleSearch,
      handleModalVisible: this.handleModalVisible,
      handleOpenModalVisible: this.handleOpenModalVisible,
      currentRecord: undefined,
      handleUpdate: undefined,
      openList: list,
      searchLoading: loading || false,
    };
    const { modalVisible, modalOpenVisible } = this.state;
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
          <Button type="primary" className={styles.button} onClick={() => this.handleModalVisible(true)} > <Icon type="folder-add" />新建项目</Button>
          <Button className={styles.button} onClick={() => this.handleOpenModalVisible(true)} > <Icon type="folder-open" />打开项目</Button>
        </Card>

        <CreateProjectForm
          {...parentMethods}
          modalVisible={modalVisible}
        />

        <OpenProjectForm
          {...parentMethods}
          modalOpenVisible={modalOpenVisible}
        />
      </Layout>
    );
  }
}

