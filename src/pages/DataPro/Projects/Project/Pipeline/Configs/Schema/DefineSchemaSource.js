import React from 'react';
import { Form, Button, message } from 'antd';
import router from 'umi/router';
import DefineSchemaWidget from '@/components/Widgets/DefineSchemaWidget';
import { configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError, expandValidateErrors } from '../Utils';

@Form.create()
class DefineSchemaSource extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      validateErrors: undefined,
    };
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      this.setState({ validateErrors: expandValidateErrors(err) });
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
            message.error(response.message);
          }
          // TODO check return value.
        });
      }
    });
  };

  render() {
    const { form, errors: givenErrors } = this.props;
    const { formValues, changed, validateErrors } = this.state;
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const errors = changed ? {} : givenErrors;
    return (
      <Form onSubmit={e => this.handleFormSubmit(e)}>
        {formItemWithError(
          form,
          formItemProps,
          {
            rules: [{ required: true, message: '目标模式不能为空' }],
          },
          errors,
          validateErrors,
          formValues,
          'schema',
          [],
          '目标模式',
          <DefineSchemaWidget />
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

export default DefineSchemaSource;
