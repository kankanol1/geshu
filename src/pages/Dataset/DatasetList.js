import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Popconfirm,
  Tag,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from './DatasetList.less';
import { buildTagSelect } from '../../utils/uiUtils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dataset, loading }) => ({
  dataset,
  loading: loading.models.dataset,
}))
@Form.create()
class DatasetList extends PureComponent {
  state = {
    selectedRows: [],
    expendForm: false,
    currentRecord: undefined,
    formValues: [],
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    // {
    //   title: '类型',
    //   dataIndex: 'type',
    //   align: 'center',
    // },
    {
      title: '是否公开',
      dataIndex: 'isPublic',
      align: 'center',
      render: val => <span>{val ? '是' : '否'}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <Link to={`/storage/dataset/show/${record.id}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`/storage/dataset/update/${record.id}`}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm
            title={record.isPublic ? '确认取消公开吗?' : '确认设为公开吗?'}
            onConfirm={() => this.handlePublic(record)}
          >
            <a>{record.isPublic ? '取消公开' : '设为公开'}</a>
          </Popconfirm>
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

  refreshParams = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataset/fetchDatasetList',
    });
  }

  /**
   * perform query and store query params locally.
   */
  performQuery = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataset/fetchDatasetList',
      payload: params,
    });

    this.refreshParams = params;
  };

  handlePublic = record => {
    const { dispatch } = this.props;
    dispatch({
      type: record.isPublic ? 'dataset/makePrivateDataset' : 'dataset/makePublicDataset',
      payload: {
        ids: [record.id],
      },
      callback: () => {
        this.performQuery(this.refreshParams);
      },
    });
  };

  handleRecordDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataset/removeDataset',
      payload: {
        ids: [record.id],
      },
      callback: () => {
        this.performQuery(this.refreshParams);
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
      dataset: { data },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // const labels = fieldsValue.labels
      //   && fieldsValue.labels.map(l => data.labels[parseInt(l, 10)]);

      const updatedAt =
        fieldsValue.updatedAt && fieldsValue.updatedAt.map(m => m.format('YYYYMMDD')).join();

      const createdAt =
        fieldsValue.createdAt && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

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
      type: 'dataset/removeDataset',
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
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.performQuery({});
  };

  handleNewDataset = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('create'));
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const {
      dataset: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否公开">
              {getFieldDecorator('isPublic', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="true">已公开</Option>
                  <Option value="false">未公开</Option>
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
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
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
    const {
      dataset: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNewDataset()}>
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
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DatasetList;
