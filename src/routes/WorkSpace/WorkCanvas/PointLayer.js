import React from 'react';
import {DraggableCore} from 'react-draggable';


const R = {normal: 8, large: 12};

class PointLayer extends React.PureComponent {

    constructor(props) {
        super(props)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.state = { hovering: []}
    }

    handleDragStop(e, draggableData) {
        console.log(e)
        console.log(draggableData)
        console.log('end drag')
        this.props.dispatch({
            type: 'work_canvas/endDrag'
        })
    }

    handleDragStart(e){
        // stop propagation to parent.
        e.stopPropagation()
        console.log('child drag start')
    }

    handleMouseEnter(e, id) {
        console.log('enter', id);
        this.setState({hovering:[id]})
    }
    handleMouseLeave(e, id) {
        this.setState({hovering:[]})
    }

    handleDrag(e, draggableData){
        console.log("circle")
        let originx = null, originy = null;
        if (draggableData.node.x === undefined) {
            originx = draggableData.node.cx.baseVal.value;
            originy = draggableData.node.cy.baseVal.value;
        } else {
            originx = draggableData.node.x.baseVal.value;
            originy = draggableData.node.y.baseVal.value;
        }
        console.log(originx, originy);
        this.props.dispatch({
            type: 'work_canvas/draggingLine',
            componentId: this.props.model.id,
            pointId: draggableData.node.id,
            draggingSource: {
                x: originx,
                y: originy
            },
            draggingTarget: {
                x: (this.props.draggingTarget.x == null ? originx :
                    this.props.draggingTarget.x) + draggableData.deltaX, 
                y: (this.props.draggingTarget.y == null ? originy :
                    this.props.draggingTarget.y) + draggableData.deltaY, 
            },
            draggingType: draggableData.node.attributes.pointtype.value,
        })
        console.log('dragging type', draggableData.node.attributes.pointtype.value)
    }

    render() {
        const points = this.props.model.points;
        const pointDict = this.props.positionDict[this.props.model.id];

        return <React.Fragment>
                {
                    points.map(
                        (point, i) => {
                            const {x, y} = pointDict[point.id]
                            let r = this.state.hovering.includes(point.id) ? R.large : R.normal;
                            return <React.Fragment key={i}>
                            {
                                // 1.  point background.
                            }
                            <circle cx={x} cy={y} r={r} stroke="#22075e" strokeWidth="1" fill="#b37feb" />
                            {
                                // 2. text.
                            }
                            <text x={x} y={y} alignmentBaseline="middle" 
                                textAnchor="middle" fill="white">
                                
                                {point.label}
                            </text>
                            {
                                // 3. opeartion circle.
                            }

                                <DraggableCore onDrag={this.handleDrag} 
                                onStop={this.handleDragStop} onStart={this.handleDragStart}>
                                        <circle cx={x} cy={y} r={R.large}
                                        onMouseEnter={e => this.handleMouseEnter(e, point.id) }
                                        onMouseLeave={e => this.handleMouseLeave(e, point.id)}
                                    style={{opacity:'0'}} stroke="#22075e" strokeWidth="1" fill="#b37feb" id={point.id} pointtype={point.type} pointconnects={point.connects}/>
                                </DraggableCore>
                        </React.Fragment>
                        }
                    )
                }
            </React.Fragment>
    }

}

export default PointLayer;