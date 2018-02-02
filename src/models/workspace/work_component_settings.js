import componentAPI from '../../services/WorkSpace/componentAPI'
import { select } from 'redux-saga/effects'
import work_component_list from './work_component_list';

export default {
    namespace: 'work_component_settings',

    state: {
        // contains all the component (including cached) settings.
        componentMetaDict: {

        },
        componentSettings: [

        ],
        currentComponent: undefined
    },

    reducers: {
        initComponentSettingsWithMeta(state, {component, code, id, name}) {
            const {componentMetaDict, componentSettings} =  state;
            componentMetaDict[code] = component;
            componentSettings.push({...component, id, name})
            // 3. don't forget to change the selection.
            return Object.assign({}, {...state, componentMetaDict, componentSettings, currentComponent: id})
        },

        initComponentSettingsForId(state, {id, code, name}) {
            console.log('init', state, id, name, code)
            //1. copy meta settings from MetaDict.
            console.log('total meta settings', Object.keys(state.componentMetaDict).length )
            const componentMetaSettings = state.componentMetaDict[code]
            console.log('meta settings', componentMetaSettings)
            //2. set this to the component settings.
            const {componentSettings} = state
            componentSettings.push({...componentMetaSettings, id, name})
            // 3. don't forget to change the selection.
            return Object.assign({}, {...state, componentSettings, currentComponent: id})
        },

        displayComponentSettingForId(state, {id}) {
            // we assume that we have all the data already. just change current component.
            console.log("current state", state)
            return Object.assign({}, {...state, currentComponent: id});
        },

        resetCurrentComponent(state) {
            return Object.assign({}, {...state, currentComponent: undefined})
        }
    },

    effects: {
        *fetchComponentSettings( {code, id, name}, {call, put}) {
            console.log("fetched...", code);
            const state = yield select((state) => state.work_component_settings);
            console.log(state)
            const {data} = yield call(componentAPI.fetchComponentSetting, code)
            console.log('fetched data, ', data)
            yield put({type: 'initComponentSettingsWithMeta', component: data, code, id, name})
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
        *displayComponentSetting({component}, {call, put, select}) {
            console.log("settings updated", component)
            const {componentMetaDict, componentSettings} = yield select(state => state.work_component_settings)
            let alreadyHaveTheSettings = false;
            componentSettings.forEach(
                cs => {
                    if (cs.id === component.id) alreadyHaveTheSettings = true;
                }
            )
            if (alreadyHaveTheSettings) {
                yield put({type: 'displayComponentSettingForId', id: component.id});
            } else {
                if (componentMetaDict[component.type] === undefined) {
                    console.log('prepare to fetch', component.code);
                    yield put({type: 'fetchComponentSettings', code: component.code, id: component.id, name: component.name})
                } else {
                    yield put({type: 'initComponentSettingsForId', 
                    id: component.id, code: component.code, name: component.name})
                }
            }

        }
    }
}