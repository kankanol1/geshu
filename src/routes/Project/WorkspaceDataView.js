import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Card, Input, Button, Select, Row, Col, List, Icon, Spin, Tooltip, Alert } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Scrollbars } from 'react-custom-scrollbars';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/addon/display/placeholder';
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
      showSider: true,
    };
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataquery/getAvailableDatabases',
      payload: {
        id: match.params.id,
      },
    });
  }

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
    this.setState({ pageSize: state.pageSize, pageNum: state.page }, () => this.performQuery());
  }

  toggleTableItemStatus(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/toggleItemStatus',
      payload: item,
    });
  }

  copySelectSql(item) {
    this.props.dispatch({
      type: 'dataquery/copyItemAsSql',
      payload: item,
    });
  }

  render() {
    const { queryResult, availableComponents } = this.props.dataquery;
    const { loading } = this.props;
    const { showSider } = this.state;

    let displayTable = null;
    if (queryResult !== undefined && queryResult.success) {
      const { data, pagination } = queryResult;
      const columns = queryResult.meta.map((m) => {
        return { Header: m.label, accessor: m.label };
      });
      const pages = Math.ceil(pagination.total / pagination.pagesize);
      displayTable = (
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
      );
    }

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
                  <CodeMirror
                    options={{
                      lineNumbers: true,
                      mode: 'text/x-hive',
                      theme: 'solarized',
                      placeholder: '输入查询sql',
                    }}
                    onChange={newValue => this.setState({ query: newValue })}
                    className={styles.codemirror}
                  />
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
                    queryResult === undefined ?
                     (loading ? <Spin /> : null)
                     : (
                       <React.Fragment>
                         {
                          queryResult.success ? displayTable :
                          <Alert message={queryResult.message} type="error" showIcon className={styles.alert} />
                        }
                       </React.Fragment>
                    )
                  }
                </Card>
              </Scrollbars>
              <div className={styles.toggleTrigger} >
                <Icon type={showSider ? 'double-right' : 'double-left'} onClick={() => this.setState({ showSider: !showSider })} />
              </div>
            </Col>
            <Col span={showSider ? 6 : 0} className={styles.rightView} >
              <div style={{ height: '100%', background: '#fff' }}>
                <Card title={(<span>可查看数据集列表</span>)}>
                  {/* <Select className={styles.componentSelector} placeholder="选择组件">
                    <Option value="lucy">lucy</Option>
                  </Select> */}
                  <List
                    size="small"
                    bordered
                    dataSource={availableComponents}
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
