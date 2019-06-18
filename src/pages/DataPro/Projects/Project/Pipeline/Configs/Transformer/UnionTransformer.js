import React from 'react';
import { Form, Button, Input, Switch, message } from 'antd';
import PageLoading from '@/components/PageLoading';
import router from 'umi/router';
import XHelp from '@/components/XHelp';
import { formItemWithError, expandValidateErrors, fakeFormItemWithError } from '../Utils';
import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import XFormError from '@/components/XFormError';

@Form.create()
class UnionTransformer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      formValues: { ...props.configs },
      schema: undefined,
      loading: true,
      validateErrors: undefined,
      flagSet: (props.configs && props.configs.addTag) || false,
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
    const { formValues, changed, loading, schema, validateErrors, flagSet } = this.state;
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
        {errors &&
          errors._ &&
          errors._.input &&
          errors._.input.schema && (
            <XFormError {...formItemProps} content={errors._.input.schema} />
          )}
        {formItemWithError(
          form,
          formItemProps,
          { valuePropName: 'checked' },
          errors,
          validateErrors,
          formValues,
          'addTag',
          false,
          <span>
            添加标记位
            <XHelp tip="启用后，可添加标记位以区分合并后的数据条目来自哪个数据集" />
          </span>,
          <Switch onChange={v => this.setState({ flagSet: v, changed: true })} />
        )}
        {flagSet &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            validateErrors,
            formValues,
            'tag',
            'tag',
            '标记位列名',
            <Input onChange={e => this.handleChange()} />
          )}
        {flagSet &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            validateErrors,
            formValues,
            'resultTags.0',
            'LEFT',
            '左数据集标记',
            <Input onChange={e => this.handleChange()} />
          )}
        {flagSet &&
          formItemWithError(
            form,
            formItemProps,
            {},
            errors,
            validateErrors,
            formValues,
            'resultTags.1',
            'RIGHT',
            '右数据集标记',
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

export default UnionTransformer;
