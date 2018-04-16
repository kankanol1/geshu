import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Card, Input, Button, Select, Row, Col, List, Icon, Form, Tooltip } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Scrollbars } from 'react-custom-scrollbars';
import WorkspaceViewMenu from './WorkspaceViewMenu';
import WorkspaceMenu from './Workspace/Menu/WorkspaceMenu';

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
      showSider: false,
    };
  }

  sampleData = [
    { tableName: 'xxx_ttt_xxx',
      projectId: 1,
      jobId: '233',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yyyy',
      componentName: 'hi',
      schema: [{ name: 'key', type: 'varchar' }, { name: 'value', type: 'varchar' }],
      hideSchema: false,
    },
    { tableName: 'xxx_zzz_xxx',
      projectId: 1,
      jobId: '233',
      jobStartTime: 'xxxx',
      jobFinishTime: 'yzzy',
      componentName: 'hai',
      schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
      hideSchema: true,
    },
  ];

  performQuery() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/querySQL',
      payload: {
        query: this.state.query,
        pageNum: this.state.pageNum,
        pageSize: this.state.pageSize,
        showSider: false,
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
    const { showSider } = this.state;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light" className={styles.dataView}>
          <Row style={{ height: '100%' }}>
            <Col span={showSider ? 18 : 24} style={{ height: '100%' }}>
              <Scrollbars>
                <Card>
                  <TextArea rows={4} placeholder="enter sql here." onChange={e => this.setState({ query: e.target.value })} />
                  <div className={styles.buttonContainer}>
                    <Button
                      type="primary"
                      className={styles.button}
                      onClick={() => { this.setState({ pageNum: 0 }, () => this.performQuery()); }}
                    >
                      <Icon type="play-circle" /> 查询
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
              </Scrollbars>
              <div className={styles.toggleTrigger} >
                <Icon type="double-left" onClick={() => this.setState({ showSider: !showSider })} />
              </div>
            </Col>
            <Col span={showSider ? 6 : 0} className={styles.rightView} >
              <div style={{ height: '100%', background: '#fff' }}>
                <Card title={(<span>组件列表</span>)}>
                  {/* <Select className={styles.componentSelector} placeholder="选择组件">
                    <Option value="lucy">lucy</Option>
                  </Select> */}
                  <List
                    size="small"
                    bordered
                    dataSource={this.sampleData}
                    renderItem={item => (
                      <List.Item>
                        <div className={styles.componentCell}>
                          <strong><a>{item.tableName}</a></strong>
                          <span className={styles.smallIcons}>
                            <Tooltip title={item.hideSchema ? '展开schema信息' : '隐藏schema信息'}>
                              <Icon type={item.hideSchema ? 'plus' : 'minus'} onClick={() => this.toggleTableItemStatus(item)} />
                            </Tooltip>
                            <Tooltip title="复制选择语句" onClick={() => this.copySelectSql(item)} >
                              <Icon type="copy" />
                            </Tooltip>
                          </span>
                          {item.hideSchema ? null : (
                            <List
                              size="small"
                              bordered={false}
                              dataSource={item.schema}
                              renderItem={
                                  schema => (
                                    <div className={styles.tableSchema}>
                                      <span className={styles.tableSchemaName}>{schema.name}</span>
                                      <span className={styles.tableSchemaType}>{schema.type}</span>
                                    </div>
                                  )
                                }
                            />
                          )}
                        </div>
                      </List.Item>
                  )}
                  />
                </Card>
              </div>

            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}
