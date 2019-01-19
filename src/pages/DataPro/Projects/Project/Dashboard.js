import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { Popconfirm, Card, Button, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './Dashboard.less';

@connect(({ dataproDashboards, loading }) => ({
  dataproDashboards,
  loading: loading.models.dataproDashboards,
}))
class Dashboard extends PureComponent {
  state = {
    selectedRows: [],
  };

  refreshParams = [];

  componentDidMount() {
    this.performQuery({});
  }

  getColumns = id => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      // {
      //   title: '描述',
      //   dataIndex: 'description',
      // },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Button
              type="primary"
              size="small"
              onClick={() => router.push(`/projects/p/dashboard/${id}/${record.id}`)}
            >
              打开
            </Button>
            <Divider type="vertical" />
            <a onClick={() => this.handleUpdate(record)}> 编辑</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </span>
          </Fragment>
        ),
      },
    ];
  };

  performQuery = params => {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'dataproDashboards/fetchAllDashboards',
      payload: {
        id,
        ...params,
      },
    });
    this.refreshParams = params;
  };

  handleSelectRows = rows => {
    this.setState({
      ...this.state,
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.performQuery(params);
  };

  render() {
    const {
      dataproDashboards: { data },
      loading,
      match,
    } = this.props;
    const { selectedRows } = this.state;
    const { id } = match.params;

    return (
      <Card>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
              新建
            </Button>
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleMultiDelete()}>
              {selectedRows.length > 0 && <Button>批量删除</Button>}
            </Popconfirm>
          </div>
        </div>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.getColumns(id)}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    );
  }
}

export default Dashboard;
