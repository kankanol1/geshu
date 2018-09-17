import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Progress, Row, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, Tag, message, Badge, Divider } from 'antd';
import StandardTable from '../../../../components/StandardTable';
import styles from './JobList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const statusMap = {
  waiting: '排队中',
  initialized: '初始化',
  queued: '等待中',
  canceled: '已取消',
  started: '运行中',
  finished: '已完成',
  failed: '已失败',
};

const statusColorMap = {
  waiting: 'blue',
  initialized: 'cyan',
  queued: 'blue',
  canceled: '#8c8c8c',
  started: '#2db7f5',
  finished: '#87d068',
  failed: '#f50',
};

const statusIconMap = {
  waiting: 'clock-circle',
  initialized: 'loading-3-quarters',
  queued: 'clock-circle-o',
  canceled: 'close-circle-o',
  started: 'right-circle-o',
  finished: 'check-circle-o',
  failed: 'exclamation-circle-o',
};

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


@connect(({ outputview, loading }) => ({
  outputview,
  loading: loading.models.outputview,
}))
@Form.create()
export default class JobList extends PureComponent {
  state = {
    selectedRows: [],
  }

  componentDidMount() {
    this.performQuery();
  }

  refreshParams = {};

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Tag color={statusColorMap[val]}><Icon type={statusIconMap[val]} />{` ${statusMap[val]}`}</Tag>,
    },
    {
      title: '总运行时长',
      dataIndex: 'runningTime',
      render: val => moment.duration(val, 'seconds').humanize(),
    },
    {
      title: '作业提交时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '作业完成时间',
      dataIndex: 'finishedAt',
      sorter: true,
      render: (val, record) => <span>{val == null || undefined ? '-' : moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        switch (record.status) {
          case 'queued':
          case 'started':
          case 'initialized':
            // cancelable.
            return (
              <Popconfirm title="确认终止吗?" onConfirm={() => this.handleRecordCancel(record)}>
                <a>终止</a>
              </Popconfirm>
            );
          default:
            return (
              <React.Fragment>
                <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
                  <a>删除</a>
                </Popconfirm>
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: '20px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    const { onJobClicked } = this.props;
                    if (onJobClicked) onJobClicked(record.id);
                  }}
                >查看
                </Button>
              </React.Fragment>
            );
        }
      },
    },
  ];

  performQuery = (params = {}) => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'outputview/fetchJobList',
      payload: {
        id,
        ...params,
      },
    });
    this.refreshParams = params;
  }

  handleRecordDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'outputview/removeJobs',
      payload: {
        ids: [record.id],
      },
      callback: () => this.performQuery(this.refreshParams),
    });
  }

  handleRecordCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'outputview/cancelJobs',
      payload: {
        ids: [record.id],
      },
      callback: () => this.performQuery(this.refreshParams),
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      ...this.state,
      selectedRows: rows,
    });
  }

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'outputview/removeJobs',
      payload: {
        ids,
      },
      callback: () => this.performQuery(),
    });
    // update selection.
    this.setState({
      ...this.state,
      selectedRows: [],
    });
  }

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'outputview/removeJobs',
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
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.performQuery(params);
  }

  render() {
    const { outputview: { joblist: data }, loading } = this.props;
    const { selectedRows } = this.state;

    return (
      <Card>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleMultiDelete()}>
              {
                  selectedRows.length > 0 && (
                    <Button>批量删除</Button>
                  )
                }
            </Popconfirm>
          </div>
        </div>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    );
  }
}
