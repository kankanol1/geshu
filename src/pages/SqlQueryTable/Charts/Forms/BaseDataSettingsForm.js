import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Tag, Select, Collapse } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

export default class BaseDataSettingsForm extends Component {
  static defaultProps = {
    initialValue: {},
  };

  renderDataSourceSettings() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <Panel header="数据源设置" key="datasource">
        <FormItem label="数据库" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('table', {
            rules: [
              {
                required: true,
                message: '请输入数据库名',
              },
            ],
            initialValue: initialValue.table,
          })(<Input />)}
        </FormItem>
      </Panel>
    );
  }

  renderBaseDisplaySettings() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <Panel header="数据显示设置" key="selection">
        <FormItem label="X轴" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('xsource', {
            rules: [
              {
                required: true,
                message: '请设置X轴',
              },
            ],
            initialValue: initialValue.xsource,
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Y轴" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('ysource', {
            rules: [
              {
                required: true,
                message: '请设置Y轴',
              },
            ],
            initialValue: initialValue.ysource,
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
      </Panel>
    );
  }

  renderQuerySettings() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <Panel header="查询设置" key="query">
        <FormItem label="选择列" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('sqlSelect', {
            rules: [
              {
                required: true,
                message: '选择输出',
              },
            ],
            initialValue: initialValue.sqlSelect,
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="过滤条件" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('sqlWhere', {
            rules: [],
            initialValue: initialValue.sqlWhere,
          })(
            <div>
              <Tag closable>a=b</Tag>
              <Tag closable>abcsadas!=dsdsa</Tag>
              <Tag closable>a!=90</Tag>
              <Tag closable>a=ddddb</Tag>
              <Tag closable>adsadsadsadas=b</Tag>
            </div>
          )}
        </FormItem>
        <FormItem label="限制行数" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('sqlLimit', {
            rules: [
              {
                required: true,
                message: '展示行数',
              },
            ],
            initialValue: initialValue.sqlLimit,
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="排序" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('sqlSort', {
            rules: [
              {
                required: true,
                message: '排序',
              },
            ],
            initialValue: initialValue.sqlSort,
          })(
            <Select>
              <Option value="year">year</Option>
              <Option value="sales">sales</Option>
            </Select>
          )}
        </FormItem>
      </Panel>
    );
  }

  renderSettingsForm() {
    return (
      <Collapse bordered={false} defaultActiveKey={['datasource', 'selection', 'query']}>
        {this.renderDataSourceSettings()}
        {this.renderQuerySettings()}
        {this.renderBaseDisplaySettings()}
      </Collapse>
    );
  }

  render() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)} layout="horizontal">
        {this.renderSettingsForm()}
      </Form>
    );
  }
}

BaseDataSettingsForm.propTypes = {
  initialValue: PropTypes.object,
};
