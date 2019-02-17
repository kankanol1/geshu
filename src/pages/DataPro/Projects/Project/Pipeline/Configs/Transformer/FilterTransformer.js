import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import PageLoading from '@/components/PageLoading';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError } from '../Utils';
import ExpressionWidget from '@/components/Widgets/ExpressionWidget';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class FilterTransformer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      schema: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    const { id, opId } = this.props;
    getOperatorSchema({
      projectId: id,
      id: opId,
    }).then(response => {
      if (response.success) {
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
          if (response.success) {
            message.info(response.message);
            // back to pipeline.
            router.push(`/projects/p/pipeline/${id}`);
          } else {
            message.error(response.message);
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
          'expression.mode',
          'AND',
          '模式',
          <Select onChange={e => this.handleChange()}>
            <Option value="AND">AND（与）</Option>
            <Option value="OR">OR（或）</Option>
          </Select>
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'expression.conditions',
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

export default FilterTransformer;
