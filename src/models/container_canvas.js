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
                    // {
                    // /*connects to */
                    // component: 'preprocess-1',
                    // input: 'i-1',
                    // output: 'o-1'
                    // }
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
    },

    reducers: {
        moveComponent(state, {id, x, y}){
            console.log('id', id)
            console.log('move to ', x, y)
            let newState = Object.assign({}, state)
            
            let nr = newState.components.map( (component) => {
                if (component.id === id) {
                    return Object.assign({}, {...component, ...{x: x, y: y}})
                }
                else return component;
            })
            console.log(newState)
            console.log(Object.assign({}, {...state, ...{components: nr}}))
            return Object.assign({}, {...state, ...{components: nr}})
        },
        
        addLine(state, from_id, from_point, to_id, to_point){
            
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
                                // the other way round.
                                return component
                            }
                        }
                    )

                    let n = Object.assign({}, {...state, ...{components: newComponents, dragging: false, 
                        draggingTarget: {x: null, y: null}, draggingSource: {x: null, y: null}}} )
                        console.log(n)
                        return n;
                } else {
                    console.log("Error! can not add line to the same type of point.")
                }
            } else {
                console.log("Error! no overlapping point, will not add new line.")
            }

            return Object.assign({}, {...state, ...{dragging: false, 
                draggingTarget: {x: null, y: null}, draggingSource: {x: null, y: null}}} )
        },

    }
}