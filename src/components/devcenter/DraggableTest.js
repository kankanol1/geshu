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

class DraggableTest extends React.Component{
	
	handleDrag(e, ui){
		console.log(e);
		console.log(ui);
	}
	
    render(){
        return (<DraggableCore onDrag={this.handleDrag}>
            <div style={{...styles}}>Drag me to see preview</div>
            </DraggableCore>)
    }
}

export default DraggableTest;

