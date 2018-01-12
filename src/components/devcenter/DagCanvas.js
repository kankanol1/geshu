import React from 'react';
import DagNode from './DagNode';
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'

const boxTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
        const delta = monitor.getClientOffset()
        const origin = monitor.getSourceClientOffset()
        const d = monitor.getDifferenceFromInitialOffset()
        console.log('item.x', item.x, item.y);
        console.log('after', delta);
        console.log('origin', origin)
        console.log('d', d)
		const left = Math.round(d.x + item.x)
		const top = Math.round(d.y + item.y)

		component.moveBox(left, top)
	},
}

@DropTarget('dag', boxTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
class DagCanvas extends React.Component{

    
    static propTypes = {
		connectDropTarget: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {x: 0, y: 0}
	}

	moveBox(left, top) {
        console.log("move", left, top)
		this.setState({x: left, y: top})
    }
    
    render(){
        const { canDrop, isOver, connectDropTarget} = this.props
        return connectDropTarget(<div style={{width: '100%', height: '100%'}}>
            <svg style={{background: "#888", height: '100%', width: '100%'}}>
            <DagNode x={this.state.x} y = {this.state.y} />
            </svg>
        </div>)
    }
}

export default DagCanvas;