import componentAPI from '../../services/componentAPI';

export default {
  namespace: 'work_component_settings',

  state: {
    // contains all the component (including cached) settings.
    componentMetaDict: {

    },
    componentSettings: [

    ],
    currentComponent: undefined,
  },

  reducers: {
    initComponentSettingsWithMeta(state, { component, code, id, name }) {
      const { componentMetaDict, componentSettings } = state;
      componentMetaDict[code] = component;
      componentSettings.push({ ...component, id, name });
      // 3. don't forget to change the selection.
      return Object.assign({},
        { ...state, componentMetaDict, componentSettings, currentComponent: id });
    },

    initComponentSettingsForId(state, { id, code, name }) {
      // 1. copy meta settings from MetaDict.
      const componentMetaSettings = state.componentMetaDict[code];
      // 2. set this to the component settings.
      const { componentSettings } = state;
      componentSettings.push({ ...componentMetaSettings, id, name });
      // 3. don't forget to change the selection.
      return Object.assign({}, { ...state, componentSettings, currentComponent: id });
    },

    setCurrentComponent(state, { id }) {
      // we assume that we have all the data already. just change current component.
      return Object.assign({}, { ...state, currentComponent: id });
    },

    resetCurrentComponent(state) {
      return Object.assign({}, { ...state, currentComponent: undefined });
    },

  },

  effects: {
    *fetchComponentSettings({ code, id, name }, { call, put }) {
      const data = yield call(componentAPI.fetchComponentSetting, code);
      yield put({ type: 'initComponentSettingsWithMeta', component: data, code, id, name });
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
    *displayComponentSetting({ component }, { put, select }) {
      const { componentMetaDict, componentSettings } =
        yield select(state => state.work_component_settings);
      let alreadyHaveTheSettings = false;
      componentSettings.forEach(
        (cs) => {
          if (cs.id === component.id) alreadyHaveTheSettings = true;
        }
      );
      // set the id first.
      yield put({ type: 'setCurrentComponent', id: component.id });
      if (componentMetaDict[component.type] === undefined) {
        yield put({ type: 'fetchComponentSettings', code: component.code, id: component.id, name: component.name });
      } else if (!alreadyHaveTheSettings) {
        yield put({
          type: 'initComponentSettingsForId',
          id: component.id,
          code: component.code,
          name: component.name,
        });
      }
    },

  },
};
