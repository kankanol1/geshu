import React from 'react';
import Draggable, { DraggableCore } from 'react-draggable';

const styles = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
	width: '10rem',
}

class DraggableItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            x: 0,
            y: 0,
        }
    }
	
	handleDrag(e, draggableData){
		console.log(e);
		console.log(draggableData);
    }
	
    render(){

        return (<Draggable onDrag={this.handleDrag}>
            <div style={{...styles}}>Drag me to see preview</div>
            </Draggable>)
    }
}

export default DraggableItem;

