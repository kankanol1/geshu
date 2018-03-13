import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Progress, Row, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './JobList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const statusMap = {
  doing: '执行中',
  paused: '已暂停',
  done: '已完成',
  waiting: '等待中',
  canceled: '已取消',
  failed: '已失败',
};

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ jobs, loading }) => ({
  jobs,
  loading: loading.models.jobs,
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
      type: 'jobs/fetchJobList',
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => statusMap[val],
    },
    {
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
      render: (val, record) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        // switch (record.status) {
        //   case 'doing':
        //   // stop, pause.
        //   case 'paused':
        //   // resume, restart.
        //   case 'done':
        //   // delete, restart
        //   case 'waiting':
        //   // don'tknow
        //   case 'canceled':
        //   // restart.
        //   // delete
        //   case 'failed':
        //   // restart, delete
        // }
        return (
          <Fragment>
            <a onClick={() => this.handleEdit(record)} >编辑</a>
            <Divider type="vertical" />
            <Link to={`workspace/editor/${record.id}`}><a>打开</a></Link>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </Fragment>
        );
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
      type: 'jobs/fetchJobList',
      payload: params,
    });

    this.refreshParams = params;
  }

  handleRecordDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobs/removeJobs',
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

  handleUpdate = (fieldsValue, currentRecord) => {
    const { jobs: { data }, dispatch } = this.props;
    const labels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return data.labels[intL];
        }
        return l;
      });

    dispatch({
      type: 'jobs/updateProject',
      payload: {
        ...fieldsValue,
        labels: labels && labels.join(),
        id: currentRecord.id,
      },
    });
    this.handleModalVisible(false);
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;
    const { jobs: { data } } = this.props;

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
      type: 'jobs/removeJobs',
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
    const { jobs: { data } } = this.props;
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
                <Select defaultValue="">
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
    const { jobs: { data } } = this.props;
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
                <Select defaultValue="">
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
    const { jobs: { data }, loading } = this.props;
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
