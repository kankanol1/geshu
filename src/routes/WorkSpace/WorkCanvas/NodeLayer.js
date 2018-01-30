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
        this.handleDragStop = this.handleDragStop.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.hasDrag = true;
    }

    handleDragStart(e){
        // stop propagation to parent.
        e.stopPropagation()
        console.log('child drag start')
        this.hasDrag = false;
    }

    handleDragStop(e) {
        console.log('drag stop...')
        if (!this.hasDrag) {
            this.props.dispatch({
                type: 'work_canvas/updateComponentSelection',
                id: this.props.model.id,
            })
        }
        console.log('fetch...')
        /**change settings on the right side  */
        this.props.dispatch({
            type: 'work_component_settings/fetchComponentSetting',
            id: this.props.model.id,
        })
    }

    handleDrag(e, draggableData){
        this.hasDrag = true;
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

    handleContextMenu(e) {
        e.preventDefault();
        console.log('context menu', e.clientX, e.clientY)
        this.props.dispatch({
            type: 'work_canvas/openContextMenu',
            component: this.props.model,
            x: e.clientX,
            y: e.clientY
        })
    }
    
    render() {
        console.log("styles:", styles.input);
        const {x, y, width, height,name} = this.props.model;
        return  <React.Fragment><DraggableCore 
            onStop={this.handleDragStop} onDrag={this.handleDrag} onStart={this.handleDragStart}> 
            <rect x={x} y={y} rx='10' ry='10' width={width} height={height}
            onContextMenu={this.handleContextMenu}
                style={{...styles}}/>
        </DraggableCore>
        <DraggableCore
            onStop={this.handleDragStop}  onDrag={this.handleDrag} onStart={this.handleDragStart}>
            <text x={x + width/2} y={y + height/2} alignmentBaseline="middle" 
            onContextMenu={this.handleContextMenu}
                textAnchor="middle" fill="white" style={{cursor:'move'}}>{name}</text>
        </DraggableCore>
        </React.Fragment>
    }
}

export default NodeLayer;