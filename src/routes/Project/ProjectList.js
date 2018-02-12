import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tag, Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="描述"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
    </Modal>
  );
});

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const columns = [
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
    width: '400px',
    render: val => (
      <div>{val.map(
        (label) => {
          return (<Tag color="blue">{label}</Tag>);
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
];

@connect(({ project, loading }) => ({
  project,
  loading: loading.models.project,
}))
@Form.create()
export default class ProjectList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchProjectList',
    });
    dispatch({
      type: 'project/fetchProjectLabels',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    // const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'project/fetchProjectList',
      payload: params,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
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
        </Row>
      </Form>
    );
  }

  render() {
    const { project: { data }, loading } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          {this.renderSimpleForm()}
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
