import React from 'react';
import { Form } from 'antd';
import jsonpath from 'jsonpath';
import FakeFormItem from '@/components/XWidgets/UI/FakeFormItem';

const FormItem = Form.Item;

export const expandValidateErrors = err => {
  const translated = {};
  if (!err || Object.keys(err) === 0) return translated;
  const iteration = { ...err };
  const isError = obj => Object.keys(obj).length === 1 && Object.keys(obj)[0] === 'errors';
  while (Object.keys(iteration).length !== 0) {
    const expandKey = Object.keys(iteration)[0];
    const obj = iteration[expandKey];
    if (!obj || Object.keys(obj) === 0) {
      // ignore.
    } else if (isError(obj)) {
      // add to translated.
      obj.errors.forEach(i => {
        translated[expandKey] = i.message;
      });
    } else {
      // expand.
      Object.keys(obj).forEach(k => {
        iteration[`${expandKey}.${k}`] = obj[k];
      });
    }
    delete iteration[expandKey];
  }
  return translated;
};

function filterErrorsWithPrefix(errors, prefix, showUpperLevel) {
  if (!errors || Object.keys(errors) === 0) return [];
  const newKeys = showUpperLevel
    ? Object.keys(errors).filter(i => i === prefix || prefix.startsWith(i))
    : Object.keys(errors).filter(i => i.startsWith(prefix));
  const result = newKeys.map(i => errors[i]);
  return result;
}

export function formItemWithError(
  form,
  formItemProps,
  fieldOptions,
  errors,
  validateErrors,
  formValues,
  accessor,
  defaultValue,
  label,
  component
) {
  const jpValue = jsonpath.query(formValues, `$.${accessor}`);
  const initValue = jpValue.length > 0 && jpValue[0];
  const backendMessage = filterErrorsWithPrefix(errors, accessor, true);
  const validateMessage = validateErrors && validateErrors[accessor];
  const errorMessage = [];
  if (backendMessage) {
    errorMessage.push(...backendMessage);
  }
  if (validateMessage) {
    errorMessage.push(...validateMessage);
  }
  const hasError = Object.keys(errorMessage).length > 0;
  return (
    <FormItem
      {...formItemProps}
      label={label}
      help={hasError && errorMessage}
      validateStatus={(hasError && 'error') || ''}
    >
      {form.getFieldDecorator(accessor, {
        initialValue: initValue || defaultValue,
        ...fieldOptions,
      })(component)}
    </FormItem>
  );
}

export function fakeFormItemWithError(formItemProps, errors, validateErrors, accessor, component) {
  const backendMessage = filterErrorsWithPrefix(errors, accessor, false);
  const validateMessage = validateErrors && validateErrors[accessor];
  const errorMessage = [];
  if (backendMessage) {
    errorMessage.push(...backendMessage);
  }
  if (validateMessage) {
    errorMessage.push(...validateMessage);
  }
  const hasError = Object.keys(errorMessage).length > 0;
  return (
    <FakeFormItem
      {...formItemProps}
      help={hasError && errorMessage}
      validateStatus={(hasError && 'error') || ''}
    >
      {component}
    </FakeFormItem>
  );
}

export default {};
