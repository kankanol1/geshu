import key from 'keymaster'
import {message} from 'antd'

const calculatePointCenter = (x, y, width, height, xIndex, yIndex) => {
    let p_x = 0, p_y = 0;
    switch (xIndex) {
        case 0:
            /*top*/
            p_x = x + yIndex * width
            p_y = y
            break
        case 1: 
            /*right*/
            p_x = x + width
            p_y = y +height * yIndex
            break;
        case 2:
            /**bottom */
            p_x = x + height * yIndex
            p_y = y
            break;
        case 3:
            /**left */
            p_x = x
            p_y = y + height * yIndex
            break;
        default:
            break;
    }
    return {p_x, p_y}
}

export default {
    namespace: 'container_canvas',

    state: {
        components: [
            {
                id:'input',
                x: 150,
                y: 100,
                width: 100,
                height: 40,
                inputs: [
                    /*input circles*/
                ],
                outputs: [
                    /*output circles */
                    {
                        id:'o-1',
                        label: 'a',
                        hint: 'b', // occurs when hover
                        x: 1,
                        y: 0.5,
                        /**these four ranges should be updated by each component */
                        rangeXMin: null,
                        rangeXMax: null,
                        rangeYMin: null,
                        rangeYMax: null
                    }
                ],
                connect_to: [
                    {
                    /*connects to */
                    component: 'preprocess-1',
                    input: 'i-1',
                    output: 'o-1',
                    }
                ],
                connected_from: []
            }, {
                id:'preprocess-1',
                x: 400,
                y: 100,
                width: 100,
                height: 40,
                inputs: [
                    /*input circles*/
                    {
                        id:'i-1',
                        label: 'a',
                        hint: 'b', // occurs when hover
                        x: 3,
                        y: 0.5,
                    }
                ],
                outputs: [
                    /*output circles */
                    {
                        id:'o-1',
                        label: 'a',
                        hint: 'b', // occurs when hover
                        x: 1,
                        y: 0.5,
                    }
                ],
                connect_to: [],
                connected_from: []
            }
        ],
        dragging: false,
        draggingComponent: null,
        draggingPoint: null,
        draggingSource: {
            x: null,
            y: null
        },
        draggingTarget: {
            x: null,
            y: null
        },
        /* should be input or output. */
        draggingType: null,
        /**mode: select; move; */
        mode: 'select',
        selection: [
            // store selection. 
            // e.g. {type: 'component', id: 'component-id'} => select single component.
            {type: 'line', from: 'o-1', to: 'i-1', source: 'input', target: 'preprocess-1',}
            // {type: 'component', id: 'input'}
        ],
        offset: {
            x: 0,
            y: 0
        },
        scale: 1.0,
        scaleCenter: {
            x: 0,
            y: 0,
        }
    },

    reducers: {

        deleteCurrentSelection(state) {
            let selection = state.selection
            console.log("delete", selection)
            let originComponent = Object.assign([], state.components)
            let newComponents = originComponent.map(
                component => {
                    let ret = component;
                    selection.forEach(
                        select => {
                            if (select.type ==='component' && select.id === component.id) {
                                ret = null
                            } else if (select.type === 'line' && select.source === component.id) {
                                // filter in connect_to
                                let newConnectTo = component.connect_to.map(
                                    item => {
                                        if (item.output === select.from && item.input === select.to) {
                                            return null
                                        } else return item
                                    }
                                )
                                ret = Object.assign({}, {...component, ...{connect_to: newConnectTo.filter( a => a != null)}})
                            } else if (select.type === 'line' && select.target === component.id) {
                                // filter in connected_from
                                let newConnectedFrom = component.connected_from.map(
                                    item => {
                                        if (item.output === select.from && item.input === select.to) {
                                            return null
                                        } else return item
                                    }
                                )
                                ret = Object.assign({}, {...component, ...{connected_from: newConnectedFrom.filter( a => a != null)}})
                            }
                        }
                    )
                    return ret
                }
            )
            let newState = Object.assign({}, {... state, ...{components: newComponents.filter( a => a != null), selection: []}})
            console.log('after deletion',newState)
            return newState;
        },

        updateComponentSelection(state, {id}) {
            console.log('update component selection', id)
            return Object.assign({}, {...state, ...{selection: [{type: 'component', id: id}]}})
        },

        updateLineSelection(state, params) {
            console.log('update line selection', params)
            let after= Object.assign({}, {...state, ...{selection: [{...params, type: 'line'}]}})
            console.log(after)
            return after
        },

        newComponent(state, {component}) {
            console.log('new component', component) 
            let components = Object.assign([], state.components)
            components.push(component)
            return Object.assign({}, {...state, ...{components: components}})
        },

        moveComponent(state, {id, x, y}){
            let newState = Object.assign({}, state)
            
            let nr = newState.components.map( (component) => {
                if (component.id === id) {
                    return Object.assign({}, {...component, ...{x: x, y: y}})
                }
                else return component;
            })
            return Object.assign({}, {...state, ...{components: nr}})
        },

        removeLine(state, from_id, from_point, to_id, to_point){
            
        },

        deleteComponent(state, id){

        },

        draggingLine(state, {componentId, pointId, draggingSource, draggingTarget, draggingType}){
            if(!state.dragging) {
                let newState = Object.assign({}, {...state, ...{dragging: true, 
                    draggingSource: draggingSource, draggingComponent: componentId, 
                    draggingPoint: pointId, draggingTarget: draggingTarget, draggingType: draggingType}})
                // console.log('new state', newState)
                return newState
            } else {
                let newState = Object.assign({}, {...state, ...{draggingTarget: draggingTarget}})
                // console.log('new-state', newState)
                return newState
            }
        },

        endDrag(state) {
            const R = 5
            console.log('end drag')
            // detect overlapping with other points.
            let overlapped = []
            state.components.forEach(component => {
                const {x, y, width, height} = component
                component.inputs.forEach(input => {
                    const {p_x, p_y} = calculatePointCenter(x, y, width, height, input.x, input.y)
                    if (Math.abs(p_x - state.draggingTarget.x) <= R && Math.abs(p_y - state.draggingTarget.y) <=R ) {
                        overlapped.push({componentId: component.id, pointId: input.id, type: 'input'})
                    }
                })
                component.outputs.forEach(output => {
                    const {p_x, p_y} = calculatePointCenter(x, y, width, height, output.x, output.y)
                    if (Math.abs(p_x - state.draggingTarget.x) <= R && Math.abs(p_y - state.draggingTarget.y) <=R ) {
                        overlapped.push({componentId: component.id, pointId: output.id, type: 'output'})
                    }
                })
            })

            if (overlapped.length != 0) {
                const candidate = overlapped[0]
                if (candidate.type != state.draggingType) {
                    // add line.
                    let newComponents = state.components.map(
                        (component) => {
                            console.log(state.draggingType);
                            if (state.draggingType === 'output') {
                                console.log("output")
                                // add connect_to to draggingSource.
                                if (component.id === state.draggingComponent) {
                                    let connect_to = Object.assign([], component.connect_to)
                                    console.log(connect_to)
                                    connect_to.push({component: candidate.componentId, input: candidate.pointId, output: state.draggingPoint})
                                    return Object.assign({}, {...component, ...{connect_to: connect_to}} )
                                } else if (component.id === candidate.componentId) {
                                    let connected_from = Object.assign([], component.connected_from)
                                    connected_from.push({component: state.draggingComponent, output: state.draggingPoint, input: candidate.pointId})
                                    return Object.assign({}, {...component, ...{connected_from: connected_from}} )
                                } else {
                                    return component
                                }
                            } else {
                                // dragging type = input.
                                // the other way round.
                                // add connect_from to draggingSource.
                                if (component.id === state.draggingComponent) {
                                    let connected_from = Object.assign([], component.connected_from)
                                    connected_from.push({component: candidate.componentId, output: candidate.pointId, input: state.draggingPoint})
                                    return Object.assign({}, {...component, ...{connected_from: connected_from}})
                                } else if (component.id === candidate.componentId) {
                                    let connect_to = Object.assign([], component.connect_to)
                                    connect_to.push({component: state.draggingComponent, input: state.draggingPoint, output: candidate.pointId})
                                    return Object.assign({}, {...component, ...{connect_to: connect_to}} )
                                } else {
                                    return component
                                }
                            }
                        }
                    )

                    let n = Object.assign({}, {...state, ...{components: newComponents, dragging: false, 
                        draggingTarget: {x: null, y: null}, draggingSource: {x: null, y: null}}} )
                        console.log(n)
                        return n;
                } else {
                    message.info('Can not add line to the same type of point!');
                    console.log("Error! can not add line to the same type of point.")
                }
            } else {
                // message.info('Please drag the target on one of the target points.');
                console.log("Error! no overlapping point, will not add new line.")
            }

            return Object.assign({}, {...state, ...{dragging: false, 
                draggingTarget: {x: null, y: null}, draggingSource: {x: null, y: null}}} )
        },

    },

    subscriptions: {
        keyboardWatcher({dispatch}) {
            console.log('ssss')
            key('del, delete', () => {
                console.log('delete')
                return dispatch( {
                type: 'deleteCurrentSelection',
            } )})
            key('q', () => {
                console.log('q')
            })
            key('a', function(){ console.log('a'); alert('you pressed a!') });
        }
    }
}