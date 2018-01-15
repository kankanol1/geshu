import React from 'react';

import {PropTypes} from 'prop-types';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

const styles = {
    fill:'red', stroke:'black', strokeWidth:1, opacity:0.5, cursor: 'move'
}

class DraggableNode extends React.Component{

    handleDrag(e, data){
        console.log(e);
        console.log(data);
    }

    render(){
        console.log(this.props);

        return (<Draggable onDrag={this.handleDrag} bounds=".dev-canvas">
        
        <svg >
            <rect x='100' y="200" rx="10" ry="10" width="100" height="40" 
                style={{...styles}} />
                <circle cx="100" cy="200" r="4" stroke="#22075e" strokeWidth="1" fill="#b37feb" />

            <polyline points="200,120 280,120 280,110 300,110"
            style={{fill:'none',stroke:'#391085',strokeWidth:1}} />
        </svg>
                </Draggable>)
    }
}

export default DraggableNode;