import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Card, Input, Button, Select } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import WorkspaceViewMenu from './WorkspaceViewMenu';
import WorkspaceMenu from './Workspace/Menu/WorkspaceMenu';
import { makeData } from '../../utils/Fake';

import styles from './WorkspaceDataView.less';

const { Option } = Select;
const { Header } = Layout;
const { TextArea } = Input;

@connect(({ dataquery, loading }) => ({
  dataquery,
  loading: loading.models.dataquery,
}))
export default class WorkspaceDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      pageNum: 0,
      pageSize: 20,
    };
  }

  performQuery() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/querySQL',
      payload: {
        query: this.state.query,
        pageNum: this.state.pageNum,
        pageSize: this.state.pageSize,
      },
    });
  }

  fetchData(state, instance) {
    console.log('fetch data called');
    this.setState({ pageSize: state.pageSize, pageNum: state.page }, () => this.performQuery());
  }

  render() {
    const { queryResult } = this.props.dataquery;
    const data = (queryResult === undefined) ? undefined : queryResult.data;
    const columns = (queryResult === undefined) ? undefined :
      queryResult.meta.map((m) => {
        return { Header: m.label, accessor: m.label };
      });
    const pagination = (queryResult === undefined) ? undefined : queryResult.pagination;
    const pages = (queryResult === undefined) ? undefined :
      pagination.total / pagination.pageSize;
    const { loading } = this.props;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Card>
            <TextArea rows={4} placeholder="enter sql here." onChange={e => this.setState({ query: e.target.value })} />
            <div className={styles.buttonContainer}>
              <span> From </span>
              <Select defaultValue="lucy" style={{ width: 240 }} onChange={this.handleChange}>
                <Option value="jack">Component1 Output</Option>
                <Option value="lucy">Component2 Output</Option>
                <Option value="disabled">Component3 Output1</Option>
                <Option value="Yiminghe">Component3 Output2</Option>
              </Select>
              <Button
                type="primary"
                className={styles.button}
                onClick={() => { this.setState({ pageNum: 0 }, () => this.performQuery()); }}
              >
                查询
              </Button>
              <Button type="danger" className={styles.button}>清空</Button>
            </div>
          </Card>
          <Card>
            {
              queryResult === undefined ? null : (
                <ReactTable
                  manual
                  loading={loading}
                  data={data}
                  columns={columns}
                  defaultPageSize={this.state.pageSize}
                  className="-striped -highlight"
                  pages={pages}
                  onFetchData={(state, instance) => this.fetchData(state, instance)}
                />
              )}
          </Card>
        </Layout>
      </Layout>
    );
  }
}
