import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Progress, Row, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, Tag, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GraphJobList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const statusMap = {
  initialized: '初始化',
  queued: '等待中',
  canceled: '已取消',
  started: '运行中',
  finished: '已完成',
  failed: '已失败',
};

const statusColorMap = {
  initialized: 'cyan',
  queued: 'blue',
  canceled: '#8c8c8c',
  started: '#2db7f5',
  finished: '#87d068',
  failed: '#f50',
};

const statusIconMap = {
  initialized: 'loading-3-quarters',
  queued: 'clock-circle-o',
  canceled: 'close-circle-o',
  started: 'right-circle-o',
  finished: 'check-circle-o',
  failed: 'exclamation-circle-o',
};

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ graph_job, loading }) => ({
  graph_job,
  loading: loading.models.graph_job,
}))
@Form.create()
export default class JobList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    expendForm: false,
    currentRecord: undefined,
    formValues: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph_job/fetchJobList',
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      render: val => val.split('-')[val.split('-').length - 1],
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Tag color={statusColorMap[val]}><Icon type={statusIconMap[val]} />{` ${statusMap[val]}`}</Tag>,
    },
    /* {
      title: '作业进度',
      dataIndex: 'progress',
      render: (val, record) => (
        (record.status === 'done') ?
          <Progress percent={100} status="success" />
          :
          (
            <Progress
              percent={Math.floor(val * 100)}
              status={record.status === 'doing' ?
                'active' :
                  record.status === 'failed' ? 'exception' : '-'}
            />
          )
      ),
    }, */
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
              <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            );
        }
      },
    },
  ];

  refreshParams = {}

  /**
   * perform query and store query params locally.
   */
  performQuery = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph_job/fetchJobList',
      payload: params,
    });

    this.refreshParams = params;
  }

  handleRecordDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph_job/removeJobs',
      payload: {
        ids: [record.id],
        refreshParams: this.refreshParams,
      },
    });
  }

  handleRecordCancel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph_job/cancelJobs',
      payload: {
        ids: [record.id],
        refreshParams: this.refreshParams,
      },
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      ...this.state,
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;
    const { graph_job: { data } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const labels = fieldsValue.labels
        && fieldsValue.labels.map(l => data.labels[parseInt(l, 10)]);

      const updatedAt = fieldsValue.updatedAt
        && fieldsValue.updatedAt.map(m => m.format('YYYYMMDD')).join();

      const createdAt = fieldsValue.createdAt
        && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

      const values = {
        ...fieldsValue,
        labels: labels && labels.join(),
        updatedAt,
        createdAt,
      };

      this.setState({
        formValues: values,
      });

      this.performQuery(values);
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.performQuery(params);
  }

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'graph_job/removeJobs',
      payload: {
        ids,
        refreshParams: this.refreshParams,
      },
    });
    // update selection.
    this.setState({
      ...this.state,
      selectedRows: [],
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.performQuery({});
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { graph_job: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {
                    Object.entries(statusMap).map(
                      ([k, v]) => (<Option key={k} value={k}> {v} </Option>)
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const { graph_job: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {
                    Object.entries(statusMap).map(
                      ([k, v]) => (<Option key={k} value={k}> {v} </Option>)
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createdAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="更新时间">
              {getFieldDecorator('finishedAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    console.log(this.props, 'props')
    const { graph_job: { data }, loading } = this.props;
    const { selectedRows, modalVisible, currentRecord } = this.state;

    const parentMethods = {
      data,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      currentRecord,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
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
      </PageHeaderLayout>
    );
  }
}
