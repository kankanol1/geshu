import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Popconfirm, Card, Button, Divider } from 'antd';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TaskList.less';

@connect(({ tasks, loading }) => ({
  tasks,
  loading: loading.models.tasks,
}))
class TaskList extends React.Component {
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
              onClick={() => router.push(`/tasks/t/show/${record.id}`)}
            >
              打开
            </Button>
            <Divider type="vertical" />
            <a onClick={() => router.push(`/tasks/t/edit/${record.id}`)}> 编辑</a>
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
      type: 'tasks/fetchAllTasks',
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

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'tasks/deleteTask',
      payload: {
        ids,
      },
      callback: () => this.performQuery(this.refreshParams),
    });
    // update selection.
    this.setState({
      ...this.state,
      selectedRows: [],
    });
  };

  handleRecordDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tasks/deleteTask',
      payload: {
        ids: [record.id],
      },
      callback: () => this.performQuery(this.refreshParams),
    });
  };

  render() {
    const {
      tasks: { data },
      loading,
      match,
    } = this.props;
    const { selectedRows } = this.state;
    const { id } = match.params;
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push(`/tasks/t/new`)}>
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
      </PageHeaderWrapper>
    );
  }
}
export default TaskList;
