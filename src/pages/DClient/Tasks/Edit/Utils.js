import React from 'react';
import { Form } from 'antd';
import jsonpath from 'jsonpath';

const FormItem = Form.Item;

export function formItemWithError(
  prefix,
  form,
  formItemProps,
  fieldOptions,
  errors,
  formValues,
  accessor,
  defaultValue,
  label,
  component
) {
  const jpValue = jsonpath.query(formValues, `$.${accessor}`);
  const initValue = (jpValue.length > 0 && jpValue[0]) || defaultValue;
  return (
    <FormItem
      {...formItemProps}
      label={label}
      help={errors[accessor]}
      validateStatus={errors[accessor] && 'error'}
    >
      {form.getFieldDecorator(`${prefix}.${accessor}`, {
        initialValue: initValue || defaultValue,
        ...fieldOptions,
      })(component)}
    </FormItem>
  );
}

export default {};
