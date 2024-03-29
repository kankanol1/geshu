import React from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PageLoading from '@/components/PageLoading';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { getOperatorSchema, configOperator } from '@/services/datapro/pipelineAPI';
import { formItemWithError, expandValidateErrors, fakeFormItemWithError } from '../Utils';
import ExpressionWidget from '@/components/Widgets/ExpressionWidget';
import XHelp from '@/components/XHelp';

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
      validateErrors: undefined,
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
    if (v === 'NONE') {
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
    const { formValues, changed, loading, validateErrors, schema } = this.state;
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
            validateErrors,
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
            validateErrors,
            formValues,
            'criteria.conditions',
            [],
            <span>
              过滤表达式
              <XHelp tip="填入文本值时请使用英文单引号，如：x.field='文本内容'" />{' '}
            </span>,
            <ExpressionWidget
              loptions={schema.i1.map(i => `${i.name}`)}
              onChange={e => this.handleChange()}
              cellWrapper={(column, items, index, Cell) =>
                fakeFormItemWithError(
                  formItemProps,
                  errors,
                  validateErrors,
                  `criteria.conditions.${index}.${column.name}`,
                  Cell
                )
              }
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

export default FilterTransformer;
