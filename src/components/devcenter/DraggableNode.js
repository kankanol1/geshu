import React from 'react';

import {PropTypes} from 'prop-types';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

const styles = {
    fill:'red', stroke:'black', strokeWidth:1, opacity:0.5, cursor: 'move'
}

class DraggableNode extends React.Component{
    render(){
        return (<Draggable><rect x={this.props.x} y={this.props.y} rx="10" ry="10" width="100" height="40" 
                style={{...styles}} />
                </Draggable>)
    }
}

export default DraggableNode;