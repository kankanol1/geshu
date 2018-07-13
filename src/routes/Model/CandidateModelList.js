import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Popconfirm, Tag, Row, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ModelList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/** the creation form. */

const ModifyForm = Form.create()((props) => {
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
      title="编辑项目"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => { handleModalVisible(); }}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="编号"
      >
        {form.getFieldDecorator('id', {
          initialValue: currentRecord === undefined ? '' : currentRecord.id,
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="名称"
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '模型名称不能为空' }],
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
          rules: [{ required: true, message: '项目描述不能为空' }],
          initialValue: currentRecord === undefined ? '' : currentRecord.description,
        })(
          <TextArea placeholder="请输入" rows={2} />
        )}
      </FormItem>
    </Modal>
  );
});

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ candidatemodels, loading }) => ({
  candidatemodels,
  loading: loading.models.candidatemodels,
}))
@Form.create()
export default class CandidateModelList extends PureComponent {
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
      type: 'candidatemodels/fetchCandidateModelList',
    });
  }

  columns = [
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
      title: '所属项目',
      dataIndex: 'projectName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'isOnline',
      render: val => (val ? <Tag color="#87d068">已上线</Tag> : <Tag color="#bfbfbf">未上线</Tag>),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确认公开至模型库吗?" onConfirm={() => this.changeMakePublic(record)}>
            <a>公开</a>
          </Popconfirm>
          <Divider type="vertical" />
          {
            record.isOnline
            ? (
              <Popconfirm title="确认下线吗?" onConfirm={() => this.handleOfflineModel(record)}>
                <a>下线</a>
              </Popconfirm>
              )
               :
               (
                 <Popconfirm title="确认上线吗?" onConfirm={() => this.handleOnlineModel(record)}>
                   <a>上线</a>
                 </Popconfirm>
              )
          }
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
      type: 'candidatemodels/fetchCandidateModelList',
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
      type: 'candidatemodels/removeCandidateModel',
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
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatemodels/updateCandidateModel',
      payload: {
        ...fieldsValue,
        id: currentRecord.id,
      },
    });
    this.handleModalVisible(false);
  }

  changeMakePublic = (record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatemodels/publishCandidateModels',
      payload: {
        ids: [record.id],
      },
    });
  }

  handleOnlineModel = (record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatemodels/onlineCandidateModels',
      payload: {
        ids: [record.id],
      },
    });
  }

  handleOfflineModel = (record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatemodels/offlineCandidateModels',
      payload: {
        ids: [record.id],
      },
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;
    const { candidatemodels: { data } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const createdAt = fieldsValue.createdAt
        && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

      const values = {
        ...fieldsValue,
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
      type: 'candidatemodels/removeCandidateModel',
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

  handleMultiPublish = () => {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(record => record.id);
    dispatch({
      type: 'candidatemodels/publishCandidateModels',
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


  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const { candidatemodels: { data } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模型名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属项目">
              {getFieldDecorator('projectName')(
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
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { candidatemodels: { data }, loading } = this.props;
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
              {this.renderAdvancedForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Popconfirm title="确认发布吗?" onConfirm={() => this.handleMultiPublish()}>
                {
                  selectedRows.length > 0 && (
                    <Button type="primary">批量发布</Button>
                  )
                }
              </Popconfirm>
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
        <ModifyForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
