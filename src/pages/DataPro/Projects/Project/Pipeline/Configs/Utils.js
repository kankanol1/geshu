import React from 'react';
import { Form } from 'antd';
import jsonpath from 'jsonpath';

const FormItem = Form.Item;

function filterErrorsWithPrefix(errors, prefix) {
  if (!errors || Object.keys(errors) === 0) return [];
  const newKeys = Object.keys(errors).filter(i => i.startsWith(prefix));
  const result = newKeys.map(i => errors[i]);
  return result;
}

export function formItemWithError(
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
  const initValue = jpValue.length > 0 && jpValue[0];
  const errorMessage = filterErrorsWithPrefix(errors, accessor);
  const hasError = Object.keys(errorMessage).length > 0;
  return (
    <FormItem
      {...formItemProps}
      label={label}
      help={errorMessage}
      validateStatus={hasError && 'error'}
    >
      {form.getFieldDecorator(accessor, {
        initialValue: initValue || defaultValue,
        ...fieldOptions,
      })(component)}
    </FormItem>
  );
}

export default {};
