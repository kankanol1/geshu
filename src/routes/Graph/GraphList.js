import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Dropdown, Icon, Row, Col, Card, Form, Input, Button, Menu, DatePicker, Divider, Tag } from 'antd';
import StandardTable from '../../components/StandardTable';
import Layout from '../../layouts/PageHeaderLayout';
import styles from './GraphList.less';
import CreateGraphForm from './CreateGraphForm';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ graph, loading }) => ({
  graph,
  loading: loading.models.graph,
}))
@Form.create()
export default class ProjectList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    currentRecord: undefined,
    formValues: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/init',
    });
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '项目名',
      dataIndex: 'name',
    },
    {
      title: '项目描述',
      dataIndex: 'description',
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      render: val => (
        <Tag color="blue">{val}</Tag>
      ),
    },
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
          <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <Link to={`/graph/detail/schema/${record.id}`}>设计器</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/graph/detail/mapper/${record.id}`}>数据导入</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/graph/detail/query/${record.id}`}>数据查询</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/graph/detail/explore/${record.id}`}>数据探索</Link>
              </Menu.Item>
            </Menu>
          }
          >
            <a className="ant-dropdown-link" href="#">
              打开
              <Icon type="down" />
            </a>
          </Dropdown>
          <Divider type="vertical" />
          <a onClick={() => this.handleEdit(record)} >编辑</a>
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
      type: 'graph/fetchProjectList',
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

  handleRecordDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/removeProject',
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

  handleAdd = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'graph/createProject',
      payload: {
        ...fieldsValue,
        refreshParams: this.refreshParams,
      },
    });

    this.handleModalVisible(false);
  }

  handleUpdate = (fieldsValue, currentRecord) => {
    const { graph: { data }, dispatch } = this.props;
    dispatch({
      type: 'graph/updateProject',
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
    const { graph: { data } } = this.props;

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
      type: 'graph/removeProject',
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

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { graph: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="项目名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createdAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="更新时间">
              {getFieldDecorator('updatedAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { graph: { data }, loading } = this.props;
    const { selectedRows, modalVisible, currentRecord } = this.state;
    const parentMethods = {
      labels: data.labels,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      currentRecord,
      handleUpdate: this.handleUpdate,
    };

    return (
      <Layout>
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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
        <CreateGraphForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </Layout>
    );
  }
}
