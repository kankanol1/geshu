import React from 'react';
import { Form, Button, message } from 'antd';
import router from 'umi/router';
import PageLoading from '@/components/PageLoading';
import MappingSchemaWidget from '@/components/Widgets/MappingSchemaWidget';
import {
  getOperatorSchema,
  getOperatorObjectiveSchema,
  configOperator,
} from '@/services/datapro/pipelineAPI';
import { formItemWithError, expandValidateErrors } from '../Utils';

@Form.create()
class SchemaMappingOperator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      validateErrors: undefined,
      objSchema: undefined,
      inputSchema: undefined,
      schemaLoading: true,
      objSchemaLoading: true,
    };
  }

  componentDidMount() {
    // fetch previous schema definition.

    const { id, opId } = this.props;
    getOperatorSchema({
      projectId: id,
      id: opId,
    }).then(response => {
      if (response && response.success) {
        this.setState({ inputSchema: response.data, schemaLoading: false });
      } else {
        // eslint-disable-next-line
        console.error('not handled exception, response', response);
      }
    });
    getOperatorObjectiveSchema({
      projectId: id,
      id: opId,
    }).then(response => {
      if (response && response.success) {
        this.setState({ objSchema: response.data, objSchemaLoading: false });
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
            message.error(response.message);
          }
          // TODO check return value.
        });
      }
    });
  };

  render() {
    const { form, errors: givenErrors } = this.props;
    const {
      formValues,
      changed,
      objSchemaLoading,
      schemaLoading,
      objSchema,
      inputSchema,
      validateErrors,
    } = this.state;
    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const errors = changed ? {} : givenErrors;
    if (objSchemaLoading || schemaLoading) {
      return <PageLoading />;
    }
    return (
      <Form onSubmit={e => this.handleFormSubmit(e)}>
        {formItemWithError(
          form,
          formItemProps,
          {
            rules: [{ required: true, message: '模式映射不能为空' }],
          },
          errors,
          validateErrors,
          formValues,
          'schema',
          [],
          '模式映射',
          // We assume both returns one value.
          <MappingSchemaWidget objSchema={objSchema.i1} inputSchema={inputSchema.i2} />
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

export default SchemaMappingOperator;
