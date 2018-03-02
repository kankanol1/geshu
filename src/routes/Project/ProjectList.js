import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm, Tag, Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ProjectList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const buildTagSelect = (options, tagMode = false) => {
  const children = [];
  for (let i = 0; i < options.length; i++) {
    children.push(<Option key={i.toString(options.length)}>{options[i]}</Option>);
  }
  return (
    <Select
      mode={tagMode ? 'tags' : 'multiple'}
      style={{ width: '100%' }}
      placeholder="选择标签"
      tokenSeparators={[',']}
    >
      {children}
    </Select>
  );
};

/** the creation form. */

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleUpdate, handleModalVisible } = props;
  const { data, currentRecord } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (currentRecord) {
        handleUpdate(fieldsValue, currentRecord);
        form.resetFields();
      } else {
        handleAdd(fieldsValue);
        form.resetFields();
      }
    });
  };
  return (
    <Modal
      title={currentRecord === undefined ? '新建项目' : '编辑项目'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => { handleModalVisible(); }}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="名称"
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '项目名称' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.name,
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="描述"
      >
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: '项目描述' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.description,
        })(
          <TextArea placeholder="请输入" rows={2} />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="标签"
      >
        {form.getFieldDecorator('labels', {
          initialValue: currentRecord === undefined ? [] : currentRecord.labels,
        })(
          buildTagSelect(data.labels, true)
        )}
      </FormItem>
    </Modal>
  );
});

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ project, loading }) => ({
  project,
  loading: loading.models.project,
}))
@Form.create()
export default class ProjectList extends PureComponent {
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
      type: 'project/init',
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
      title: '标签',
      dataIndex: 'labels',
      render: val => (
        <div>{val.map(
          (label) => {
            return (<Tag color="blue" key={label}>{label}</Tag>);
          }
        )}
        </div>
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
          <a onClick={() => this.handleEdit(record)} >编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleOpen(record)}>打开</a>
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
      type: 'project/fetchProjectList',
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
      type: 'project/removeProject',
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
    const { project: { data }, dispatch } = this.props;
    const labels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return data.labels[intL];
        }
        return l;
      });

    dispatch({
      type: 'project/createProject',
      payload: {
        ...fieldsValue,
        labels: labels && labels.join(),
        refreshParams: this.refreshParams,
      },
    });

    this.handleModalVisible(false);
  }

  handleUpdate = (fieldsValue, currentRecord) => {
    const { project: { data }, dispatch } = this.props;
    const labels = fieldsValue.labels
      && fieldsValue.labels.map((l) => {
        const intL = parseInt(l, 10);
        if (!isNaN(intL)) {
          return data.labels[intL];
        }
        return l;
      });

    dispatch({
      type: 'project/updateProject',
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
    const { project: { data } } = this.props;

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
      type: 'project/removeProject',
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
    const { project: { data } } = this.props;
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
            <FormItem label="标签名">
              {getFieldDecorator('labels')(
                buildTagSelect(data.labels)
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
    const { project: { data } } = this.props;
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
          <Col md={16} sm={24}>
            <FormItem label="标签名">
              {getFieldDecorator('labels')(
                buildTagSelect(data.labels)
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
              {getFieldDecorator('updatedAt')(
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
    const { project: { data }, loading } = this.props;
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
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
