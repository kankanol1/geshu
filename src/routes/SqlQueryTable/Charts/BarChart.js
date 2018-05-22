import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import ConfiguredChart from './ConfiguredChart';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

const data = [
  { year: 1, sales: 38 },
  { year: 2, sales: 52 },
  { year: 3, sales: 61 },
  { year: 4, sales: 145 },
  { year: 5, sales: 48 },
  { year: 6, sales: 38 },
  { year: 7, sales: 38 },
  { year: 8, sales: 38 },
];
const cols = {
  sales: { tickInterval: 20 },
};


@Form.create()
export default class BarChart extends ConfiguredChart {
  state = {
    columns: [
      { name: 'key', type: 'string' },
      { name: 'value', type: 'integer' },
    ],
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
    });
  }

  renderConfiguration = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={e => this.handleSubmit(e)} layout="horizontal">
          <ButtonGroup style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit"><Icon type="play-circle-o" />生成图表</Button>
            <Button><Icon type="plus" />保存设置</Button>
          </ButtonGroup>
          <FormItem label="数据库" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('table', {
              rules: [{
                required: true, message: '请输入数据库名',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="X轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('x-axis', {
              rules: [{
                required: true, message: '请设置X轴',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Y轴" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('y-axis', {
              rules: [{
                required: true, message: '请设置Y轴',
              }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }

  renderChart = () => {
    return (
      <div>
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis name="year" title />
          <Axis name="sales" />
          <Tooltip crosshairs={{ type: 'rect' }} />
          <Geom type="interval" position="year*sales" />
        </Chart>
      </div>
    );
  }
}
