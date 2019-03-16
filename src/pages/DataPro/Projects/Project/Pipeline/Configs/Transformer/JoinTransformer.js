import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import PageLoading from '@/components/PageLoading';
import router from 'umi/router';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import SelectColumnWidget from '@/components/Widgets/SelectColumnWidget';
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
          'CROSS',
          '连接模式(Join Type)',
          <Select onChange={e => this.handleChange()}>
            <Option value="INNER">内连接（INNER JOIN）</Option>
            <Option value="LEFT">左外连接（LEFT OUTER JOIN）</Option>
            <Option value="RIGHT">右外连接（RIGHT OUTER JOIN）</Option>
            <Option value="OUTER">全连接（FULL OUTER JOIN）</Option>
            <Option value="CROSS">笛卡尔积（CROSS PRODUCT）</Option>
          </Select>
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'lcolumn',
          undefined,
          '左列',
          <SelectColumnWidget onChange={e => this.handleChange()} schema={schema.i1} />
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'rcolumn',
          undefined,
          '右列',
          <SelectColumnWidget onChange={e => this.handleChange()} schema={schema.i2} />
        )}
        {/* {formItemWithError(
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
        )} */}
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
