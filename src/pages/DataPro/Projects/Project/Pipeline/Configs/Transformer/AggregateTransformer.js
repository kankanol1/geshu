import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import router from 'umi/router';
import PageLoading from '@/components/PageLoading';
import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError, expandValidateErrors } from '../Utils';
import MultiColumnSelector from '@/components/Widgets/Column/MultiColumnSelector';
import AggregateTable from '@/components/Widgets/Composite/AggregateTable';

@Form.create()
class AggregateTransformer extends React.PureComponent {
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
            message.error(response || response.message || 'error');
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
          'aggregates',
          [],
          '聚集字段',
          <AggregateTable schema={schema.i1 || []} />
        )}
        {formItemWithError(
          form,
          formItemProps,
          {},
          errors,
          validateErrors,
          formValues,
          'groupBy',
          [],
          '按列分组',
          <MultiColumnSelector schema={schema.i1 || []} multiple />
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

export default AggregateTransformer;
