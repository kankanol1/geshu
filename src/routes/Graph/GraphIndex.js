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
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/fetchRecent',
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
  render() {
    const { recentGraph } = this.props.graph;
    const loading = this.props.loading || recentGraph.loading;
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
                onClick={e => this.setState({ modalVisible: true })}
              >
                <Icon type="folder-add" />新建项目
              </Button>
              ) : null
          }
          <Button className={styles.button}> <Icon type="folder-open" />打开项目</Button>

        </Card>
      </Layout>
    );
  }
}
