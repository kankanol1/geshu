import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Row, Col, Card, Form, Input, Button, DatePicker, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ModelList.less';
import ModelDetailsDialog from './ModelDetailsDialog';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ servingmodels, loading, global }) => ({
  servingmodels,
  loading: loading.models.servingmodels,
  currentUser: global.currentUser,
}))
@Form.create()
class ServingModelList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    expendForm: false,
    currentRecord: undefined,
    formValues: [],
    modelMetrics: {
      visible: false,
      id: undefined,
    },
  };

  refreshParams = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'servingmodels/fetchModelList',
    });
  }

  getColumns = currentUser => {
    return [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '模型描述',
        dataIndex: 'description',
      },
      {
        title: '发布地址',
        dataIndex: 'url',
        render: (val, record) => <Link to={`/models/serving/test/${record.id}`}>{val}</Link>,
      },
      {
        title: '上线时间',
        dataIndex: 'onlinedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'onlinedBy',
      },
      {
        title: '操作',
        render: (text, record) =>
          currentUser.userName === record.onlinedBy || currentUser.role === 'admin' ? (
            <React.Fragment>
              <a
                onClick={() => {
                  this.setState({ modelMetrics: { visible: true, id: record.id } });
                }}
              >
                详细
              </a>
              <Divider type="vertical" />
              <Link to={`/models/serving/test/${record.id}`}>模型测试</Link>
              <Divider type="vertical" />
              <Popconfirm title="确认下线吗?" onConfirm={() => this.handleRecordDelete(record)}>
                <a>下线</a>
              </Popconfirm>
            </React.Fragment>
          ) : null,
      },
    ];
  };

  /**
   * perform query and store query params locally.
   */
  performQuery = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'servingmodels/fetchModelList',
      payload: params,
    });

    this.refreshParams = params;
  };

  handleEdit = record => {
    // handle record edit.
    this.setState({
      ...this.state,
      currentRecord: record,
      modalVisible: true,
    });
  };

  handleRecordDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'servingmodels/offlineModel',
      payload: {
        ids: [record.id],
        refreshParams: this.refreshParams,
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const {
      servingmodels: { data },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const createdAt =
        fieldsValue.createdAt && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

      const values = {
        ...fieldsValue,
        createdAt,
      };

      this.setState({
        formValues: values,
      });

      this.performQuery(values);
    });
  };

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
  };

  handleMultiDelete = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'servingmodels/offlineModel',
      payload: {
        ids,
        refreshParams: this.refreshParams,
      },
    });
    // update selection.
    this.setState({
      selectedRows: [],
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.performQuery({});
  };

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const {
      servingmodels: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模型名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发布地址">
              {getFieldDecorator('url')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="发布时间">
              {getFieldDecorator('publishedAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      servingmodels: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const { id, visible } = this.state.modelMetrics;
    return (
      <PageHeaderLayout
        breadcrumbList={[
          {
            title: '首页',
            href: '/',
          },
          {
            title: '模型服务',
          },
        ]}
      >
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <div className={styles.tableListOperator}>
              <Popconfirm title="确认下线吗?" onConfirm={() => this.handleMultiDelete()}>
                {selectedRows.length > 0 && <Button>批量下线</Button>}
              </Popconfirm>
            </div>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.getColumns(this.props.currentUser)}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
          <ModelDetailsDialog
            id={id}
            visible={visible}
            onCancel={() => {
              this.setState({ modelMetrics: { visible: false, id: undefined } });
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ServingModelList;
