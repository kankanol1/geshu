import store from '../../index';

export default function validate(formData, errors, jsonSchema, uiSchema, currentComponent) {
  // select what we needed.
  const { schema, components } = store.getState().work_canvas;
  // TODO check error according to the current component infos.
  // error add example.
  // errors.sourceConf.format.value.addError('error!!!!!!!');
  return errors;
}
