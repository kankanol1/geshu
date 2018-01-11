import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'

const style = {
	height: '12rem',
	width: '12rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	color: 'white',
	padding: '1rem',
	textAlign: 'center',
	fontSize: '1rem',
	lineHeight: 'normal',
	float: 'left',
}

const boxTarget = {
	drop() {
		return { name: 'Dustbin' }
	},
}

@DropTarget('dag', boxTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    offset: monitor.getSourceClientOffset(),
}))
export default class WorkCanvas extends Component {
	static propTypes = {
		connectDropTarget: PropTypes.func.isRequired,
		isOver: PropTypes.bool.isRequired,
		canDrop: PropTypes.bool.isRequired,
	}

	render() {
		const { canDrop, isOver, connectDropTarget, offset } = this.props
		const isActive = canDrop && isOver

        console.log(offset);

		let backgroundColor = '#222'
		if (isActive) {
			backgroundColor = 'darkgreen'
		} else if (canDrop) {
			backgroundColor = 'darkkhaki'
		}

		return connectDropTarget(
			<div style={{ ...style, backgroundColor }}>
                {isActive ? 'Release to drop' : 'Drag a box here'} <br/>
                position: {offset == null? 'unknown:unkonwn': offset.x+":"+offset.y}, 
			</div>,
		)
	}
}