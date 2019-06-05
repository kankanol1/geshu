import React from 'react';
import { Form, Tabs, Row, Col, Menu, Switch, Input, Select, TimePicker } from 'antd';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const dayOfWeek = [
  { name: '周一', value: '2' },
  { name: '周二', value: '3' },
  { name: '周三', value: '4' },
  { name: '周四', value: '5' },
  { name: '周五', value: '6' },
  { name: '周六', value: '7' },
  { name: '周日', value: '1' },
];

const parseObjectFromExp = value => {
  const defaultValue = {
    frequency: 'day',
    time: '00:00',
    date_month: undefined,
    date_week: undefined,
  };
  let parseValue;
  if (value) {
    // parse value.
    const splitArr = value.split(' ');
    if (splitArr.length !== 6) {
      console.warn('incorrect format for value, will ignore', value); // eslint-disable-line
    } else {
      const [_, minute, hour, dom, month, dow] = splitArr;
      // set minute
      const time = `${hour}:${minute}`;
      let frequency = 'day';
      if (dom === '?') {
        frequency = 'week';
      } else if (dom !== '*') {
        frequency = 'month';
      }
      const date_week = ['*', '?'].includes(dow) ? undefined : dow.split(',');
      const date_month = ['*', '?'].includes(dom) ? undefined : dom.split(',');
      parseValue = {
        frequency,
        time,
        date_week,
        date_month,
        expression: value,
      };
    }
  }
  return parseValue || defaultValue;
};

@Form.create()
class XCronExp extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      ...parseObjectFromExp(value),
      expression: value,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    const { form } = this.props;
    if (value !== this.state.expression) {
      // set value.
      const obj = parseObjectFromExp(value);
      this.setState({ ...obj });
      const currentKeys = Object.keys(form.getFieldsValue());
      const currentValues = {};
      Object.keys(obj).forEach(i => {
        if (currentKeys.includes(i)) {
          currentValues[i] = obj[i];
        }
      });
      form.setFieldsValue({
        ...currentValues,
        time: moment(obj.time, 'HH:mm'),
      });
    }
  }

  triggerUpdate = () => {
    // try to generate the cron expression.
    const { frequency, time, date_week, date_month } = this.state;
    let expression;
    const [hour, minute] = time.includes(':') ? time.split(':') : ['0', '0'];
    switch (frequency) {
      case 'day':
        expression = `0 ${minute} ${hour} * * ?`; // fire every day
        break;
      case 'week': {
        const weekStr = date_week && date_week.length > 0 ? date_week.join(',') : '?';
        expression = `0 ${minute} ${hour} ? * ${weekStr}`;
        break;
      }
      case 'month': {
        const monthStr = date_month && date_month.length > 0 ? date_month.join(',') : '?';
        expression = `0 ${minute} ${hour} ${monthStr} * ?`;
        break;
      }
      default:
        break;
    }
    const { onChange } = this.props;
    this.setState({ expression });
    if (onChange) {
      onChange(expression);
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { frequency, time, date_month, date_week } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="时间">
            {getFieldDecorator('time', {
              initialValue: moment(time, 'HH:mm'),
            })(
              <TimePicker
                format="HH:mm"
                onChange={(v, sv) => this.setState({ time: sv }, () => this.triggerUpdate())}
              />
            )}
          </Form.Item>
          <Form.Item label="频率">
            {getFieldDecorator('frequency', {
              initialValue: frequency,
            })(
              <Select
                onChange={v => {
                  this.setState({ frequency: v }, () => this.triggerUpdate());
                }}
              >
                <Option value="day">每天</Option>
                <Option value="week">每周</Option>
                <Option value="month">每月</Option>
                {/* <Option value="year">每年</Option> */}
              </Select>
            )}
          </Form.Item>
          {frequency === 'week' && (
            <Form.Item label="日期">
              {getFieldDecorator('date_week', {
                initialValue: date_week,
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择执行日期"
                  style={{ width: '100%' }}
                  onChange={v => this.setState({ date_week: v }, () => this.triggerUpdate())}
                >
                  {dayOfWeek.map(i => (
                    <Option key={i.value}>{i.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
          {frequency === 'month' && (
            <Form.Item label="日期">
              {getFieldDecorator('date_month', {
                initialValue: date_month,
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择执行日期"
                  style={{ width: '100%' }}
                  onChange={v => this.setState({ date_month: v }, () => this.triggerUpdate())}
                >
                  {[...Array(31).keys()].map(i => i + 1).map(i => (
                    <Option key={i}>{i}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
        </Form>
      </div>
    );
  }
}

export default XCronExp;
