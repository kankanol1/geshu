import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import PageLoading from '@/components/PageLoading';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError } from '../Utils';

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
          'column',
          schema.i1[0].name,
          '过滤列',
          <Select onChange={e => this.handleChange()}>
            {schema.i1.map(i => (
              <Option value={i.name}>
                {i.name}({i.type})
              </Option>
            ))}
          </Select>
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          formValues,
          'value',
          '',
          '过滤值',
          <Input onChange={e => this.handleChange()} />
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
