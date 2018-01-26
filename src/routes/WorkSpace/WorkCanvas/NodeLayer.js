import React from 'react';
import {DraggableCore} from 'react-draggable';

const styles = {
    fill:'#722ed1', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}


/**
 * Node Layer: the bottom/first layer of the work canvas.
 * Only draw the nodes.
 */
class NodeLayer extends React.PureComponent {
    
    constructor(props) {
        super(props)
        this.handleDrag = this.handleDrag.bind(this)
        // this.handleDragStop = this.handleDragStop.bind(this)
        this.handleRectClick = this.handleRectClick.bind(this)
    }

    handleRectClick(e) {
        // e.preventDefault()
        console.log('clicked', e)
        // this.props.dispatch({
        //     type: 'work_canvas/updateComponentSelection',
        //     id: this.props.model.id,
        // })
    }

    handleDragStart(e){
        // stop propagation to parent.
        e.stopPropagation()
        console.log('child drag start')
    }

    handleDragStop(e) {
        console.log('drag stop.')
    }

    handleDrag(e, draggableData){
        console.log(e)
        console.log(draggableData)
        console.log("rect", this.props.model.x)
        this.props.dispatch({
            type: 'work_canvas/moveComponent',
            id: this.props.model.id,
            deltaX: draggableData.deltaX,
            deltaY: draggableData.deltaY,
            originX: this.props.model.x,
            originY: this.props.model.y
            
        })
        console.log("update component selection")
        console.log('dispatch', this.props.model.x + draggableData.deltaX,
            this.props.model.y + draggableData.deltaY)
    }
    
    render() {
        console.log("styles:", styles.input);
        const {x, y, width, height,name} = this.props.model;
        return  <React.Fragment><DraggableCore 
            onStop={this.handleDragStop} onDrag={this.handleDrag} onStart={this.handleDragStart}> 
            <rect x={x} y={y} rx='10' ry='10' width={width} height={height}
                style={{...styles}} onClick={this.handleRectClick}/>
        </DraggableCore>
        <DraggableCore
            onStop={this.handleDragStop}  onDrag={this.handleDrag} onStart={this.handleDragStart}>
            <text x={x + width/2} y={y + height/2} alignmentBaseline="middle" 
                textAnchor="middle" fill="white" style={{cursor:'move'}}
                onClick={this.handleRectClick} >{name}</text>
        </DraggableCore>
        </React.Fragment>
    }
}

export default NodeLayer;