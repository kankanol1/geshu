import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Tag, Row, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DatabaseList.less';
import { buildTagSelect } from '../../utils/uiUtils';
import CreateDatabaseForm from './CreateDatabaseForm';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ database, loading }) => ({
  database,
  loading: loading.models.database,
}))
@Form.create()
export default class DatabaseList extends PureComponent {
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
      type: 'database/init',
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '数据库名',
      dataIndex: 'name',
    },
    // {
    //   title: '数据库描述',
    //   dataIndex: 'description',
    // },
    {
      title: '数据库表名',
      dataIndex: 'tableName',
    },
    // {
    //   title: '数据库',
    //   dataIndex: 'schema',
    // },
    {
      title: '是否公开',
      dataIndex: 'isPublic',
      render: val => <span>{val ? '是' : '否'}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },
    {
      title: '创建时间',
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
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEdit(record)} >编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handlePublic(record)}>{record.isPublic ? '公开' : '不公开'}</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleRecordDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  refreshParams = {}

  /**
   * perform query and store query params locally.
   */
  performQuery = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'database/fetchDatabaseList',
      payload: params,
    });

    this.refreshParams = params;
  }

  handleEdit = (record) => {
    // handle record edit.
    this.setState({
      ...this.state,
      currentRecord: record,
      modalVisible: true,
    });
  }
  handlePublic = (record) => {
    const { dispatch } = this.props;
    console.log(record, 'record');
    dispatch({
      type: 'database/updateDatabase',
      payload: {
        id: record.id,
        isPublic: !record.isPublic,
      },
    });
  }
  handleRecordDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'database/removeDatabase',
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
    const { project: { data }, dispatch } = this.props;
    dispatch({
      type: 'database/updateDatabase',
      payload: {
        ...fieldsValue,
        id: currentRecord.id,
      },
    });
    this.handleModalVisible(false);
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;
    const { database: { data } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // const labels = fieldsValue.labels
      //   && fieldsValue.labels.map(l => data.labels[parseInt(l, 10)]);

      const updatedAt = fieldsValue.updatedAt
        && fieldsValue.updatedAt.map(m => m.format('YYYYMMDD')).join();

      const createdAt = fieldsValue.createdAt
        && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

      const values = {
        ...fieldsValue,
        // labels: labels && labels.join(),
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

  handleModalVisible = (visible) => {
    this.setState({ ...this.state,
      modalVisible: !!visible,
      currentRecord: undefined,
    });
  }

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'database/removeDatabase',
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
    const { database: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据库名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="数据表名">
              {getFieldDecorator('taableName')(
                <Input placeholder="请输入" />
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
    const { database: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据库名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem label="数据表名">
              {getFieldDecorator('tableName')(
                <Input placeholder="请输入" />
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
            <FormItem label="编号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否公开">
              {getFieldDecorator('isPublic')(
                <Input placeholder="请输入true或false" />
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
    const { database: { data }, loading } = this.props;
    const { selectedRows, modalVisible, currentRecord } = this.state;

    const parentMethods = {
      // labels: data.labels,
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
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
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
        <CreateDatabaseForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
