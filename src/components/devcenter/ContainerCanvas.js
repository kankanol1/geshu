import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import DagComponent from './DagComponent';
import SvgComponent from './SvgComponent';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster'

const styles = {
    fill:'#722ed1', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}


const maskStyles = {
        fill:'#fff', stroke:'#22075e', strokeWidth:1, opacity:0.3,
}

class ContainerCanvas extends React.Component{

        constructor(props) {
                super(props)
                this.handleDrag = this.handleDrag.bind(this)
                this.handleDragStop = this.handleDragStop.bind(this)
                this.handleDragStart = this.handleDragStart.bind(this)
        }

        handleDrag(e, draggableData) {
                // update selection rect.
                console.log('svg', e)
                console.log('svg',draggableData)
                console.log('props', this.props.runtime)
                console.log('delta', draggableData.deltaX, draggableData.deltaY)
                this.props.dispatch({
                        type: 'container_canvas/dragCanvas',
                        startX: e.offsetX,
                        startY: e.offsetY,
                        currentX: draggableData.deltaX,
                        currentY: draggableData.deltaY,
                })
        }

        handleDragStop() {
                this.props.dispatch({
                        type: 'container_canvas/canvasDragStop'
                })
        }

        handleDragStart() {
                console.log('svg drag start', key.isPressed('space'))
                this.props.dispatch({
                        type: 'container_canvas/modeChange',
                        isMoveMode: key.isPressed('space')
                })
        }

    render(){
            const {dragging, startX, startY, stopX, stopY} = this.props.runtime;
        return (<div style={{width: '100%', height: '100%'}} className="dev-canvas">
        <div>offset: ({this.props.offset.x}, {this.props.offset.y})</div>
        <DraggableCore onDrag={this.handleDrag} onStop={this.handleDragStop} onStart={this.handleDragStart}>
        <svg style={{background: '#fafafa', height: '100%', width: '100%'}}>

        {this.props.components.map((component, i) => 
                <SvgComponent model={component} 
                        dragging={this.props.dragging}
                        draggingSource = {this.props.draggingSource}
                        draggingTarget = {this.props.draggingTarget}
                        draggingComponent = {this.props.draggingComponent}
                        draggingPoint = {this.props.draggingPoint}
                        dispatch = {this.props.dispatch}
                        components = {this.props.components}
                        key = {i}
                        mode = {this.props.mode}
                        selection = {this.props.selection}
                        offset = {this.props.offset}
                         />)}
        {
                dragging ? 
                        <rect x={startX < stopX ? startX : stopX} y = {startY < stopY? startY: stopY} 
                                width={Math.abs(stopX - startX)} height={Math.abs(stopY - startY)} style={{...maskStyles}}/>
                : null
        }
        </svg>
        </DraggableCore>
        </div>
        )
    }
}
/**
 * <rect x={100} y={100} rx="10" ry="10" width="100" height="40" 
                style={{...styles}} />
        
        <circle cx="200" cy="120" r="4" stroke="#22075e" strokeWidth="1" fill="#b37feb" />

        <rect x={300} y={100} rx="10" ry="10" width="100" height="40" 
                style={{...styles}} />
        
        <circle cx="300" cy="110" r="4" stroke="#22075e" strokeWidth="1" fill="#b37feb" />

        <circle cx="300" cy="130" r="4" stroke="#22075e" strokeWidth="1" fill="#b37feb" />

        <polyline points="200,120 280,120 280,110 300,110"
  style={{fill:'none',stroke:'#391085',strokeWidth:1}} />

<rect x={300} y={300} rx="10" ry="10" width="100" height="40" 
                style={{...styles, fill: '#13c2c2'}} />
        
        <circle cx="400" cy="320" r="4" stroke="#00474f" strokeWidth="1" fill="#36cfc9" />

        <rect x={300} y={400} rx="10" ry="10" width="100" height="40" 
                style={{...styles, fill: '#13c2c2' }} />
        
        <circle cx="300" cy="410" r="4" stroke="#00474f" strokeWidth="1" fill="#36cfc9" />

        <circle cx="300" cy="430" r="4" stroke="#00474f" strokeWidth="1" fill="#36cfc9" />

        <polyline points="400,320 410,320 410,390 290,390 290,410 300,410"
  style={{fill:'none',stroke:'#00474f',strokeWidth:1}} />

 */
export default connect(({container_canvas}) => container_canvas) (ContainerCanvas);