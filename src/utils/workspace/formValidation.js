import { getFromRegistory } from '../../common/registry';

const getStore = () => getFromRegistory('store');

export default function validate(formData, errors, jsonSchema, uiSchema, currentComponent) {
  // select what we needed.
  const { schema, components } = getStore().getState().workcanvas;
  // TODO check error according to the current component infos.
  // error add example.
  // errors.sourceConf.format.value.addError('error!!!!!!!');
  return errors;
}
