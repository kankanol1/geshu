import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Card, Input, Select, Row, Col, List, Icon, Spin, Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SqlQueryTable from '../../components/SqlQueryTable';
import WorkspaceViewMenu from './WorkspaceViewMenu';
import WorkspaceMenu from './Workspace/Menu/WorkspaceMenu';
import FloatDrawerTrigger from '../../components/FloatDrawerTrigger';
import PersistTableForm from './PersistDataForm';

import styles from './WorkspaceDataView.less';

const { Option } = Select;
const { Header } = Layout;

@connect(({ dataquery, loading }) => ({
  dataquery,
  loading: loading.models.dataquery,
}))
export default class WorkspaceDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSider: true,
      modalVisible: false,
      selectItem: {},
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/clean',
    });
  }

  handleQuery(query, pageNum, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataquery/querySQLTmp',
      payload: {
        query,
        pageNum,
        pageSize,
      },
    });
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
  persistSelectSql(item) {
    this.props.dispatch({
      type: 'dataquery/persistQuery',
      payload: item,
    });
  }
  handleModalVisible = (visible, item) => {
    this.setState({ ...this.state,
      modalVisible: !!visible,
      selectItem: item,
    });
  }

  render() {
    const { queryResult, availableComponents } = this.props.dataquery;
    const { loading } = this.props;
    const { showSider, selectItem } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      persistSelectSql: this.persistSelectSql,
      dispatch: this.props.dispatch,
      selectItem,
    };
    const { modalVisible } = this.state;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Header style={{ padding: '0px', height: '48px', lineHeight: '46px', background: '#eee' }}>
          <WorkspaceMenu env={['dataview']} />
          <WorkspaceViewMenu currentPath={this.props.location} />
        </Header>
        <Layout style={{ padding: '0', height: '100%' }} theme="light" className={styles.dataView}>
          <Row style={{ height: '100%' }}>
            <Col span={showSider ? 18 : 24} style={{ height: '100%' }}>
              <Scrollbars >
                <SqlQueryTable
                  queryResult={queryResult}
                  loading={loading}
                  onQuery={(query, pageNum, pageSize) => this.handleQuery(query, pageNum, pageSize)}
                  // you can also set the query value like this.
                  // sql="select * from item"
                />
              </Scrollbars>

              <FloatDrawerTrigger
                position="right"
                open={showSider}
                style={{ right: '4px' }}
                toggle={() => this.setState({ showSider: !showSider })}
              />

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
                          <strong><a style={{ width: '140px', marginRight: '20px', wordBreak: 'break-all', display: 'inline-block' }}>{item.tableName}</a></strong> <span style={{ fontStyle: 'italic' }}>{item.name}</span>
                          <span className={styles.smallIcons}>
                            <Tooltip title={item.hideSchema ? '展开schema信息' : '隐藏schema信息'}>
                              <Icon type={item.hideSchema ? 'plus' : 'minus'} onClick={() => this.toggleTableItemStatus(item)} />
                            </Tooltip>
                            <Tooltip title="复制选择语句" onClick={() => this.copySelectSql(item)} >
                              <Icon type="copy" />
                            </Tooltip>
                            {
                              item.persist ? null :
                              (
                                <Tooltip title="持久化于数据库" onClick={() => this.handleModalVisible(true, item)} >
                                  <Icon type="cloud-upload" />
                                </Tooltip>
                              )
                            }
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
          <PersistTableForm
            {...parentMethods}
            modalVisible={modalVisible}
          />
        </Layout>
      </Layout>
    );
  }
}
