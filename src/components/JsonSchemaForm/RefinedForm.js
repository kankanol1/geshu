import React from 'react';
import Form from 'react-jsonschema-form';
import { retrieveSchema } from 'react-jsonschema-form/lib/utils';
import validateFormData, { toErrorList } from './validate';

export default class RefinedForm extends Form {
  validate(formData, schema = this.props.schema) {
    const { validate, transformErrors } = this.props;
    const { definitions } = this.getRegistry();
    const resolvedSchema = retrieveSchema(schema, definitions, formData);
    return validateFormData(
      formData,
      resolvedSchema,
      validate,
      transformErrors
    );
  }
}
