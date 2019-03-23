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
  let initValue = defaultValue;
  if (formValues[prefix]) {
    const jpValue = jsonpath.query(formValues[prefix], `$.${accessor}`);
    initValue = jpValue.length > 0 && jpValue[0];
  }
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
