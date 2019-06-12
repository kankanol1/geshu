import React from 'react';
import { Form, Button, message } from 'antd';
import router from 'umi/router';
import PageLoading from '@/components/PageLoading';
import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError, expandValidateErrors } from '../Utils';
import FillNullConfig from '@/components/Widgets/Composite/FillNullConfig';

@Form.create()
class FillNullTransformer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      schema: undefined,
      loading: true,
      validateErrors: undefined,
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
            message.error((response && response.message) || '执行出错，请重试');
          }
          // TODO check return value.
        });
      }
    });
  };

  render() {
    const { form, errors: givenErrors } = this.props;
    const { formValues, changed, loading, schema, validateErrors } = this.state;
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const errors = changed ? {} : givenErrors && givenErrors[0];
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
          validateErrors,
          formValues,
          'items',
          [],
          '列配置',
          <FillNullConfig
            schema={schema.i1 || []}
            value={formValues}
            onChange={v => this.setState({ formValues: v })}
          />
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

export default FillNullTransformer;
