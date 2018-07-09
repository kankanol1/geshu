import React, { Component } from 'react';
import { Layout, Card, Button, Icon, Divider, Spin, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';
import styles from './WorkspaceIndex.less';

import CreateProjectForm from '../CreateProjectForm';
import OpenProjectForm from '../OpenProjectForm';

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
    formValues: [],
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
    const values = {
      ...fieldsValue,
      labels: labels && labels.join(),
      refreshParams: this.refreshParams,
    };
    this.setState({
      formValues: values,
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
  handleStandardTableChange = (pagination) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    dispatch({
      type: 'project/fetchProjectList',
      payload: params,
    });
    this.refreshParams = params;
  }
  handleModalVisible = (visible) => {
    this.setState({ ...this.state,
      modalVisible: !!visible,
      currentRecord: undefined,
    });
  }

  handleOpenModalVisible= (visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchProjectList',
    });
    this.setState({ ...this.state,
      modalOpenVisible: !!visible,
      currentRecord: undefined,
      openList: [],
    });
  }

  render() {
    const { recentProjects, data: { labels }, data: { list } } = this.props.project;
    const loading = this.props.loading ||
      recentProjects.loading || recentProjects.data === undefined;
    const parentMethods = {
      labels,
      handleSearch: this.handleSearch,
      handleModalVisible: this.handleModalVisible,
      handleOpenModalVisible: this.handleOpenModalVisible,
      handleStandardTableChange: this.handleStandardTableChange,
      currentRecord: undefined,
      handleUpdate: undefined,
      openList: list,
      pagination: this.props.project.data.pagination,
      searchLoading: loading || false,
      dispatch: this.props.dispatch,
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
          dispatch={this.props.dispatch}
          labels={labels}
          onOk={(id) => {
            this.handleModalVisible(false);
            this.props.dispatch(routerRedux.push(`/project/workspace/editor/${id}`));
          }}
          onCancel={() => this.handleModalVisible(false)}
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

