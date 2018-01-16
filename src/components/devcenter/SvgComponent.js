import React from 'react';
import {DraggableCore} from 'react-draggable';
import {calculatePointCenter} from '../../utils/PositionCalculation'

const styles = {
    fill:'#722ed1', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}

class SvgComponent extends React.Component{

    constructor(props) {
        super(props)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
    }
    
    handleDragStop(e, draggableData) {
        this.props.dispatch({
            type: 'container_canvas/endDrag'
        })
    }

    handleDrag(e, draggableData){
        console.log(e)
        console.log(draggableData)
        switch (draggableData.node.tagName){
            case "circle":
                console.log("circle")
                console.log(draggableData.node.cx.baseVal.value, draggableData.node.cy.baseVal.value)
                this.props.dispatch({
                    type: 'container_canvas/draggingLine',
                    componentId: this.props.model.id,
                    pointId: draggableData.node.id,
                    draggingSource: {
                        x: draggableData.node.cx.baseVal.value,
                        y: draggableData.node.cy.baseVal.value
                    },
                    draggingTarget: {
                        x: (this.props.draggingTarget.x == null ? draggableData.node.cx.baseVal.value :
                            this.props.draggingTarget.x) + draggableData.deltaX, 
                        y: (this.props.draggingTarget.y == null ? draggableData.node.cy.baseVal.value :
                            this.props.draggingTarget.y) + draggableData.deltaY, 
                    },
                    draggingType: draggableData.node.attributes.pointtype.value,
                })
                console.log('dragging type', draggableData.node.attributes.pointtype.value)
                break;
            case "rect":
                console.log("rect", this.props.model.x)
                this.props.dispatch({
                    type: 'container_canvas/moveComponent',
                    id: this.props.model.id,
                    x: this.props.model.x + draggableData.deltaX,
                    y: this.props.model.y + draggableData.deltaY
                    
                })
                console.log('dispatch', this.props.model.x + draggableData.deltaX,
                    this.props.model.y + draggableData.deltaY)
                    
                break;
            default:
            console.log("unknown type")
        }
    }

    calculateLineStr(srcX, srcY, desX, desY){
        const stepMax = 10;
        let str = null;
        str= `${srcX}, ${srcY} ${desX}, ${desY}`;
        console.log(str);
        return str;
    }

    render() {
        const {x, y, width, height, inputs, outputs} = this.props.model
        const {dragging, draggingComponent, draggingPoint, draggingSource, draggingTarget} = this.props

        let draggingView = null;
        const outputPoints = []

        if (dragging && draggingComponent === this.props.model.id) {
            draggingView = <polyline points={this.calculateLineStr( draggingSource.x, 
                draggingSource.y, draggingTarget.x, draggingTarget.y)}
                style={{fill:'none',stroke:'#391085',strokeWidth:1}} />
        }
        return <React.Fragment>
            <DraggableCore onDrag={this.handleDrag}>
                <rect x={x} y={y} rx='10' ry='10' width={width} height={height}
                    style={{...styles}} />
            </DraggableCore>
            { draggingView }
            {
                /* create input points. */
                this.props.model.inputs.map(
                    (point, i) => {
                        const {p_x, p_y} = calculatePointCenter(x, y, width, height, point.x, point.y)
                        return <DraggableCore key={i} onDrag={this.handleDrag} onStop={this.handleDragStop}>
                            <circle cx={p_x} cy={p_y} r="4" 
                            stroke="#22075e" strokeWidth="1" fill="#b37feb" id={point.id} pointtype='input'/>
                        </DraggableCore>
                    }
                )
            }
            {
                /* create output points. */
                this.props.model.outputs.map(
                    (point, i) => {
                        const {p_x, p_y} = calculatePointCenter(x, y, width, height, point.x, point.y)
                        outputPoints.push({p_x: p_x, p_y: p_y, id: point.id})
                        return <DraggableCore key={i} onDrag={this.handleDrag} onStop={this.handleDragStop}>
                            <circle cx={p_x} cy={p_y} r="4" 
                            stroke="#22075e" strokeWidth="1" fill="#b37feb" id={point.id} pointtype='output'/>
                        </DraggableCore>
                    }
                )
            } 
            {
                // render lines, only render connect_to.
                this.props.model.connect_to.map(
                    (line, i) => {
                        let res = null;
                        this.props.components.forEach(
                            (c,i) => {
                                if (c.id === line.component) {
                                    c.inputs.forEach(
                                        (input) => {
                                            const {p_x, p_y} = calculatePointCenter(c.x, c.y, c.width, c.height, input.x, input.y)
                                            const o_x = p_x, o_y = p_y
                                            if (input.id === line.input) {
                                                outputPoints.forEach(
                                                    ({p_x, p_y, id}) => {
                                                        if (id === line.output) {
                                                            console.log("yahaha")
                                                            res = <polyline key={i} points={this.calculateLineStr(p_x, 
                                                                p_y, o_x, o_y)}
                                                                style={{fill:'none',stroke:'#391085',strokeWidth:1}} />
                                                        }
                                                    }
                                                )
                                            } 
                                        }
                                    )
                                }
                            }
                        )
                        console.log(res)
                        return res;
                    }
                )
            }
            </React.Fragment>
        
    }

}

export default SvgComponent;