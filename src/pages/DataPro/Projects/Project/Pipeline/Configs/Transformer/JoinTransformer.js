import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PageLoading from '@/components/PageLoading';
import router from 'umi/router';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import JoinColumnSelector from '@/components/Widgets/JoinColumnSelector';
import ExpressionWidget from '@/components/Widgets/ExpressionWidget';
import { formItemWithError } from '../Utils';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class JoinTransformer extends React.Component {
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

  handleModeChange = v => {
    if (v === 'NONE') {
      this.setState({ diying: true });
    } else {
      this.setState({ diying: false });
    }
    this.handleChange();
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
          'joinType',
          'OUTER',
          '连接模式(Join Type)',
          <Select onChange={e => this.handleChange()}>
            <Option value="INNER">内连接（INNER JOIN）</Option>
            <Option value="LEFT">左外连接（LEFT OUTER JOIN）</Option>
            <Option value="RIGHT">右外连接（RIGHT OUTER JOIN）</Option>
            <Option value="OUTER">全连接（FULL OUTER JOIN）</Option>
          </Select>
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'columns',
          [],
          '选择列',
          <JoinColumnSelector
            onChange={e => this.handleChange()}
            schemas={{ L: schema.i1, R: schema.i2 }}
          />
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'criteria.mode',
          'AND',
          '模式',
          <Select onChange={e => this.handleModeChange(e)}>
            <Option value="AND">AND（与）</Option>
            <Option value="OR">OR（或）</Option>
            <Option value="NONE">自定义</Option>
          </Select>
        )}
        {this.state.diying &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            formValues,
            'criteria.ude',
            '',
            '自定义过滤表达式',
            <TextArea rows={5} onChange={e => this.handleChange()} />
          )}
        {!this.state.diying &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            formValues,
            'criteria.conditions',
            [],
            '过滤表达式',
            <ExpressionWidget onChange={e => this.handleChange()} />
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

export default JoinTransformer;
