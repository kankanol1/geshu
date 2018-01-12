import React from 'react';
import {DragSource} from 'react-dnd';
import {PropTypes} from 'prop-types';

const styles = {
    fill:'red', stroke:'black', strokeWidth:1, opacity:0.5, cursor: 'move'
}

const BoxSource = {
	beginDrag(props) {
        const{x, y} = props
		return {x, y}
	},
}

@DragSource('dag', BoxSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
class DagNode extends React.Component{
    static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
    }

    render(){
        const {isDragging, connectDragSource} = this.props
        const opacity = isDragging ? 0.4 : 1
        console.log("isDragging", isDragging)
        return connectDragSource( <rect x={this.props.x} y={this.props.y} rx="10" ry="10" width="100" height="40" 
                style={{...styles, opacity}} />
            )
    }
}

export default DagNode;