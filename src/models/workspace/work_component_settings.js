import componentAPI from '../../services/WorkSpace/componentAPI'
import { select } from 'redux-saga/effects'
import work_component_list from './work_component_list';

export default {
    namespace: 'work_component_settings',

    state: {
        // contains all the component (including cached) settings.
        componentDict: {

        },
        currentComponent: undefined
    },

    reducers: {
        addToComponentDict(state, {component, id}) {
            console.log('state', state)
            return Object.assign({}, {...state, ...{
                componentDict: {
                    ... state.componentDict,
                    id: component
                },
                currentComponent:
                    id
            }})
        }
    },

    effects: {
        *fetchComponentSetting( {id}, {call, put}) {
            console.log("fetched...", id);
            const state = yield select((state) => state.work_component_settings);
            console.log(state)
            const {data} = yield call(componentAPI.fetchComponentSetting, {id})
            console.log('fetched data, ', data)
            yield put({type: 'addToComponentDict', payload: {component: data, id: id}})
        }
    }
}