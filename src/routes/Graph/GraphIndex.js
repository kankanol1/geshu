import React, { Component } from 'react';
import { Layout, Card, Button, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './GraphIndex.less';

const { Header } = Layout;

@connect(({ graph, loading }) => ({
  graph,
  loading: loading.models.project,
}))
export default class GraphIndex extends Component {
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

  render() {
    const { recentGraph } = this.props.graph;
    const loading = this.props.loading || recentGraph.loading;
    return (
      <Layout className={styles.contentLayout} theme="light">
        <Card title="图数据库列表" className={styles.firstCard}>
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
          <Button type="primary" className={styles.button}> <Icon type="folder-add" />新建数据库</Button>
          <Button className={styles.button}> <Icon type="folder-open" />打开数据库</Button>
        </Card>
      </Layout>
    );
  }
}
