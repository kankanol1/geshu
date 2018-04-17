import React, { Component } from 'react';
import { Layout, Card, Button, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './GraphIndex.less';
import CreateGraphForm from './CreateGraphForm';


@connect(({ graph, loading }) => ({
  graph,
  loading: loading.models.graph,
}))
export default class GraphIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentRecord: undefined,
      modalOpenVisible: false,
      openList: [],
      formValues: [],
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/fetchRecent',
    });
    dispatch({
      type: 'graph/fetchLabelsList',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/resetRecent',
    });
  }

  handleModalVisible = (visible) => {
    this.setState({ ...this.state,
      modalVisible: !!visible,
      currentRecord: undefined,
    });
  }

  handleAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/createAndRedirect',
      payload: {
        ...fieldsValue,
        redirect: 'schema',
      },
    });

    this.handleModalVisible(false);
  }

  handleSearch = (fieldsValue) => {
    const { graph: { data }, dispatch, handleSearch } = this.props;
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
      type: 'graph/fetchProjectList',
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
      type: 'graph/fetchProjectList',
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
      type: 'graph/fetchProjectList',
    });
    this.setState({ ...this.state,
      modalOpenVisible: !!visible,
      currentRecord: undefined,
      openList: [],
    });
  }
  render() {
    const { recentGraph, data: { labels, list } } = this.props.graph;
    const loading = this.props.loading || recentGraph.loading;
    const parentMethods = {
      labels,
      handleAdd: this.handleAdd,
      handleSearch: this.handleSearch,
      handleModalVisible: this.handleModalVisible,
      handleOpenModalVisible: this.handleOpenModalVisible,
      handleStandardTableChange: this.handleStandardTableChange,
      currentRecord: undefined,
      handleUpdate: undefined,
      openList: list,
      pagination: this.props.graph.data.pagination,
      searchLoading: loading || false,
      dispatch: this.props.dispatch,
    };
    const { modalVisible, modalOpenVisible } = this.state;
    return (
      <Layout className={styles.contentLayout} theme="light">
        <CreateGraphForm
          modalVisible={this.state.modalVisible}
          handleModalVisible={this.handleModalVisible}
          currentRecord={this.state.currentRecord}
          handleAdd={this.handleAdd}
        />
        <Card title="项目列表" className={styles.firstCard}>
          {
            loading ? <Spin /> :
              recentGraph.data.map(item =>
                (
                  <p key={item.id}>
                    <Link
                      to={`/graph/detail/${this.props.match.params.type}/${item.id}`}
                      className={styles.clickableItem}
                    >
                      <Icon type="file" /> {item.name} (最后编辑于 {moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')})
                    </Link>
                  </p>
                )
              )
          }
          <Divider />
          {
            this.props.match.params.type === 'schema' ? (
              <Button
                type="primary"
                className={styles.button}
                onClick={() => this.setState({ modalVisible: true })}
              >
                <Icon type="folder-add" />新建项目
              </Button>
              ) : null
          }
          <Button className={styles.button} onClick={() => this.handleOpenModalVisible(true)} >
            <Icon type="folder-open" />打开项目
          </Button>
        </Card>
      </Layout>
    );
  }
}
