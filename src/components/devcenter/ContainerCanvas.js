import React from 'react';
import { connect } from 'dva';
import DraggableNode from './DraggableNode';
import Draggable from 'react-draggable';
import DagComponent from './DagComponent';
import SvgComponent from './SvgComponent';

const styles = {
    fill:'#722ed1', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}

class ContainerCanvas extends React.Component{

        componentDidMount(){
                // upate state.
        }
    

    render(){

        return (<div style={{width: '100%', height: '100%'}} className="dev-canvas">
        <svg style={{background: '#fafafa', height: '100%', width: '100%'}}>
        
        <DagComponent onDrag={this.handleDrag} onDragStop={this.handleDragStop}/>

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
                         />)}




        
        </svg></div>
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