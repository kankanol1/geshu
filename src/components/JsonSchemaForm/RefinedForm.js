import React from 'react';
import Form from 'react-jsonschema-form';
import { retrieveSchema, setState } from 'react-jsonschema-form/lib/utils';
import validateFormData, { toErrorList } from './validate';

export default class RefinedForm extends Form {
  componentWillMount() {
    const { errors, errorSchema } = this.validate(this.state.formData);
    this.setState({ ...this.state, errors, errorSchema, submitted: false });
  }

  componentWillReceiveProps(nextProps) {
    const stat = this.getStateFromProps(nextProps);
    if (this.state.submitted) {
      // only validate after a submittion.
      const { errors, errorSchema } = this.validate(stat.formData);
      this.setState({ ...stat, errors, errorSchema, submitted: false });
    } else {
      this.setState(stat);
    }
  }

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

  // override submit
  onSubmit = (event) => {
    event.preventDefault();

    if (!this.props.noValidate) {
      const { errors, errorSchema } = this.validate(this.state.formData);
      if (Object.keys(errors).length > 0) {
        setState(this, { errors, errorSchema }, () => {
          if (this.props.onError) {
            this.props.onError(errors);
          } else {
            // eslint-disable-next-line
            console.error('Form validation failed', errors);
          }

          if (this.props.onSubmit) {
            this.props.onSubmit({ ...this.state, status: 'submitted', submitted: true });
          }
        });
        return;
      }
    }

    setState(this, { errors: [], errorSchema: {} }, () => {
      if (this.props.onSubmit) {
        this.props.onSubmit({ ...this.state, status: 'submitted', submitted: true });
      }
    });
  };
}
