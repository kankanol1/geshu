import React from 'react';
import { DraggableCore } from 'react-draggable';

const styles = {
  fill: '#722ed1', stroke: '#22075e', strokeWidth: 1, opacity: 1, cursor: 'move',
};


/**
 * Node Layer: the bottom/first layer of the work canvas.
 * Only draw the nodes.
 */
class NodeLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.hasDrag = true;
  }

  handleDragStart(e) {
    e.preventDefault();
    // stop propagation to parent.
    e.stopPropagation();
    this.hasDrag = false;
  }

  handleDragStop(e) {
    e.preventDefault();
    if (!this.hasDrag) {
      this.props.dispatch({
        type: 'work_canvas/updateComponentSelectionAndDisplaySettings',
        component: this.props.model,
      });
    }
    // we don't want to enable this right now.
    // else {
    //   // only display settings
    //   this.props.dispatch({
    //     type: 'work_component_settings/displayComponentSetting',
    //     component: this.props.model,
    //   });
    // }
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    if (draggableData.deltaX !== 0 || draggableData.deltaY !== 0) {
      this.hasDrag = true;
    }
    this.props.dispatch({
      type: 'work_canvas/moveComponentAndDisplaySettingsIfNeeded',
      component: this.props.model,
      deltaX: draggableData.deltaX,
      deltaY: draggableData.deltaY,
      originX: this.props.model.x,
      originY: this.props.model.y,

    });
  }

  handleContextMenu(e) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/openContextMenu',
      component: this.props.model,
      x: e.clientX,
      y: e.clientY,
    });
  }

  render() {
    const { x, y, width, height, name } = this.props.model;
    return (
      <React.Fragment>
        <DraggableCore
          onStop={this.handleDragStop}
          onDrag={this.handleDrag}
          onStart={this.handleDragStart}
        >
          <rect
            x={x}
            y={y}
            rx="10"
            ry="10"
            width={width}
            height={height}
            onContextMenu={this.handleContextMenu}
            style={{ ...styles }}
          />
        </DraggableCore>
        <DraggableCore
          onStop={this.handleDragStop}
          onDrag={this.handleDrag}
          onStart={this.handleDragStart}
        >
          <text
            x={x + (width / 2)}
            y={y + (height / 2)}
            alignmentBaseline="middle"
            onContextMenu={this.handleContextMenu}
            textAnchor="middle"
            fill="white"
            style={{ cursor: 'move' }}
          >
            {name}
          </text>
        </DraggableCore>
      </React.Fragment>
    );
  }
}

export default NodeLayer;
