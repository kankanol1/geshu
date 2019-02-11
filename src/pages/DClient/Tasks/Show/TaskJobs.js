import React from 'react';
import { connect } from 'dva';
import { Table, Tag } from 'antd';
import moment from 'moment';
import { status } from '@/utils/translationUtils';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '提交时间',
    dataIndex: 'createdAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: val => <Tag color={status.types[val]}>{status.names[val]}</Tag>,
  },
];

@connect(({ taskjobs, loading }) => ({
  jobs: taskjobs,
  loading: loading.models.taskjobs,
}))
class TaskJobs extends React.PureComponent {
  refreshParams = [];

  componentDidMount() {
    this.performQuery({});
  }

  performQuery = params => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'taskjobs/fetchAllJobs',
      payload: {
        id,
        ...params,
      },
    });
    this.refreshParams = params;
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
      loading,
      jobs: { data },
    } = this.props;
    const { list, pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <Table
        rowKey={record => record.id}
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={paginationProps}
        onChange={this.handleStandardTableChange}
      />
    );
  }
}

export default TaskJobs;
