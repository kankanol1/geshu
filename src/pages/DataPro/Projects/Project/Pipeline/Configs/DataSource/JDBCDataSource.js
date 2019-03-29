import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PageLoading from '@/components/PageLoading';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError } from '../Utils';
import ExpressionWidget from '@/components/Widgets/ExpressionWidget';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class JDBCDataSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      schema: undefined,
      loading: true,
      diying: props.configs && props.configs.criteria && props.configs.criteria.mode === 'NONE',
    };
  }

  componentDidMount() {
    const { id, opId } = this.props;
    getOperatorSchema({
      projectId: id,
      id: opId,
    }).then(response => {
      if (response && response.success) {
        this.setState({ schema: response.data, loading: false });
      } else {
        // eslint-disable-next-line
        console.error('not handled exception, response', response);
      }
    });
  }

  handleChange = () => {
    this.setState({ changed: true });
  };

  handleModeChange = v => {
    if (v === 'SQL') {
      this.setState({ diying: true });
    } else {
      this.setState({ diying: false });
    }
    this.handleChange();
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const { id, opId } = this.props;
        configOperator({
          projectId: id,
          config: fieldsValue,
          id: opId,
        }).then(response => {
          if (response && response.success) {
            message.info(response.message);
            // back to pipeline.
            router.push(`/projects/p/pipeline/${id}`);
          } else {
            message.error(response || response.message || 'error');
          }
          // TODO check return value.
        });
      }
    });
  };

  render() {
    const { form, errors: givenErrors } = this.props;
    const { formValues, changed, loading, schema } = this.state;
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const errors = changed ? {} : givenErrors;
    if (loading) {
      return <PageLoading />;
    }
    return (
      <Form onSubmit={e => this.handleFormSubmit(e)}>
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'Dialect',
          'MySQL',
          '数据库类型',
          // <Select onChange={e => this.handleModeChange(e)}>
          <Select>
            <Option value="MySQL">MySQL</Option>
          </Select>
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'Address', // host_key+port_key
          'jdbc://',
          '连接地址',
          <Input onChange={e => this.handleChange()} />
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'user',
          '',
          '用户名',
          <Input onChange={e => this.handleChange()} />
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'password',
          '',
          '密码',
          <Input onChange={e => this.handleChange()} />
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'database',
          '',
          '数据库',
          <Input onChange={e => this.handleChange()} />
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'encoding',
          'UTF-8',
          '编码方式',
          <Select>
            <Option value="UTF-8">UTF-8</Option>
            <Option value="GBK">GBK</Option>
          </Select>
        )}

        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'queryMode',
          '指定表名',
          '查询模式',
          <Select onChange={e => this.handleModeChange(e)}>
            <Option value="Table">指定表名</Option>
            <Option value="SQL">自定义查询语句</Option>
          </Select>
        )}

        {!this.state.diying &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            formValues,
            'table',
            '',
            '表名',
            <Input onChange={e => this.handleChange()} />
          )}

        {this.state.diying &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            formValues,
            'sql',
            '',
            '查询语句',
            <TextArea rows={5} onChange={e => this.handleChange()} />
          )}

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={false}>
            完成
          </Button>
        </div>
      </Form>
    );
  }
}

export default JDBCDataSource;
