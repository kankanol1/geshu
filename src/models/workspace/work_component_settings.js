import { message } from 'antd';
import { fetchComponentSetting, saveComponentSettings } from '../../services/componentAPI';
import { extractJsonSchema, extractUISchema, extractUISchemaForSample } from '../../utils/workspace/jsonSchemaUtils';


export default {
  namespace: 'work_component_settings',

  state: {
    // contains all the component (including cached) settings.
    componentMetaDict: {

    },
    componentSettings: {

    },

    /** stores translated uiSchema */
    uiSchemaDict: {

    },
    /** stores translated jsonSchema */
    jsonSchemaDict: {

    },

    /** stores form data */
    formDataDict: {

    },
    currentComponent: undefined,
  },

  reducers: {
    registerComponentMetaDict(state, { component, code, id, name }) {
      const { componentMetaDict } = state;
      componentMetaDict[code] = component;
      // 3. don't forget to change the selection.
      return { ...state, componentMetaDict };
    },

    initComponentSettingsForId(state, { id, code, name, projectId }) {
      // 1. copy meta settings from MetaDict.
      const componentMetaSettings = state.componentMetaDict[code];
      // 2. set this to the component settings.
      const { componentSettings, jsonSchemaDict, uiSchemaDict } = state;
      componentSettings[id] = { ...componentMetaSettings, id, name };
      const translatedJsonSchema =
        extractJsonSchema(componentMetaSettings, id, code, name, projectId);
      const translatedUISchema = extractUISchema(componentMetaSettings, id, code, name, projectId);

      jsonSchemaDict[id] = { ...translatedJsonSchema, id, name };
      uiSchemaDict[id] = { ...translatedUISchema, id, name };
      // 3. don't forget to change the selection.
      return { ...state, jsonSchemaDict, uiSchemaDict, componentSettings };
    },

    setCurrentComponent(state, { id }) {
      // we assume that we have all the data already. just change current component.
      return { ...state, currentComponent: id };
    },

    resetCurrentComponent(state) {
      return { ...state, currentComponent: undefined };
    },

    saveComponentSettingsInMemory(state, { payload }) {
      const { componentId, formData } = payload;
      const { formDataDict } = state;
      formDataDict[componentId] = formData;
      return { ...state, formDataDict };
    },

    initSettings(state, { payload }) {
      const { settings } = payload;
      // add to formData.
      return { ...state, formDataDict: settings };
    },
  },

  effects: {
    *fetchComponentSettings({ code, id, name, projectId }, { call, put }) {
      yield put({ type: 'work_canvas/addMessage', payload: { message: `加载配置[${code}](${name})...` } });
      const data = yield call(fetchComponentSetting, code);
      yield put({ type: 'registerComponentMetaDict', component: data, code, id, name });
      yield put({
        type: 'initComponentSettingsForId',
        id,
        code,
        name,
        projectId,
      });
      yield put({ type: 'work_canvas/addMessage', payload: { message: `配置[${code}](${name})加载完毕` } });
    },

    /**
     * display component settings.
     * 1. check if we already set the component.
     * 2. if yes, just display it.
     * 3. else:
     * 4. check whether we already have the meta info of the settings.
     * 5. if we have, just display that settings.
     * 6. if not, fetch from remote. add to metaDict. and execute 5.
     * @param {*} component
     * @param {*} param2
     */
    *displayComponentSetting({ component, projectId }, { put, select }) {
      const { componentMetaDict, componentSettings } =
        yield select(state => state.work_component_settings);
      const alreadyHaveTheSettings = componentSettings[component.id] !== undefined;
      // set the id first.
      yield put({ type: 'setCurrentComponent', id: component.id });
      if (componentMetaDict[component.code] === undefined) {
        yield put({ type: 'fetchComponentSettings', code: component.code, id: component.id, name: component.name, projectId });
      } else if (!alreadyHaveTheSettings) {
        yield put({
          type: 'initComponentSettingsForId',
          id: component.id,
          code: component.code,
          name: component.name,
          projectId,
        });
      }
    },

    *saveComponentSettings({ payload }, { put, call }) {
      const { projectId, componentId, formData } = payload;
      // save it locally first.
      yield put({
        type: 'saveComponentSettingsInMemory',
        payload,
      });
      const response = yield call(saveComponentSettings,
        { id: projectId, component: componentId, payload: formData });
      if (response.success) {
        // message.info(response.message);
        yield put({
          type: 'work_canvas/saveComponents',
          payload: {
            id: projectId,
          },
        });
      } else {
        message.error(response.message);
      }
    },
  },
};
