import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Button, Input, Tabs, List, Table, Icon } from 'antd';
import SplitterLayout from 'react-splitter-layout';
import 'rc-drawer/assets/index.css';
import styles from '../DatabaseQuery.less';

const { TabPane } = Tabs;

const dummyList = [
  {
    tableName: 'test1',
    name: 'hai',
    schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }],
  },
  {
    tableName: 'xxx_zzz_xxxxxx',
    name: 'hai',
    schema: [{ name: 'key', type: 'long' }, { name: 'value', type: 'varchar' }, { name: 'rowid', type: 'long' }],
  },
];

const columns = [
  {
    title: '列名',
    dataIndex: 'name',
    key: 'name',
    width: 80,
    render: v => <span style={{ fontWeight: '500', display: 'inline-block', width: '90px' }}>{v}</span>,
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
];
@connect(({ database, loading }) => ({
  database,
  loading: loading.models.dataquery,
}))
export default class SiderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: undefined,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'database/fetchAllDatabaseList',
    });
  }

  renderDatabaseTab = (tab, list) => {
    return (
      <React.Fragment>
        <Input
          placeholder="输入名称，回车过滤"
          onChange={(e) => {
            this.props.dispatch({
              type: 'database/updateSearchValue',
              payload: {
                type: tab,
                value: e.target.value,
              },
            });
          }}
          onPressEnter={() => {
            this.props.dispatch({
              type: 'database/filterAllDatabaseList',
            });
        }}
        />
        <List
          bordered
          size="small"
          dataSource={list}
          renderItem={item => (
            <List.Item
              onClick={() => this.setState({ selectedItem: item })}
              className={item === this.state.selectedItem ?
                styles.selectedItem : null}
            >
              <span className={styles.tableName}>{item.tableName}</span>&nbsp;
              <span className={styles.name}>{item.name}</span>
            </List.Item>
    )}
        />
      </React.Fragment>
    );
  }

  renderSideBarTop() {
    const { publicList, privateList } = this.props.database.displayData;
    return (
      <Tabs defaultActiveKey="public" className={styles.siderTop}>
        <TabPane tab="公开数据库" key="public">
          {this.renderDatabaseTab('public', publicList)}
        </TabPane>
        <TabPane tab="私有数据库" key="private">
          {this.renderDatabaseTab('private', privateList)}
        </TabPane>
      </Tabs>
    );
  }

  renderSideBarBottom() {
    const { selectedItem } = this.state;
    if (selectedItem === undefined) {
      return null;
    }
    const { schema } = selectedItem;
    return (
      <Tabs
        defaultActiveKey="schema"
        tabBarExtraContent={
          <Button type="danger" onClick={() => this.setState({ selectedItem: undefined })}>
            <Icon type="close" />
          </Button>
      }
      >
        <TabPane tab="表格结构" key="schema">
          <Table columns={columns} dataSource={schema} size="small" pagination={false} />
        </TabPane>
        <TabPane tab="元信息" key="meta">
          <div style={{ padding: '20px' }}>描述：{selectedItem.description === undefined ? '暂无' : selectedItem.description}</div>
        </TabPane>
      </Tabs>
    );
  }

  render() {
    return (
      <div className={styles.sider}>
        <SplitterLayout vertical>
          {this.renderSideBarTop()}
          {this.renderSideBarBottom()}
        </SplitterLayout>
      </div>
    );
  }
}
