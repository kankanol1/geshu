import React from 'react';
import { DraggableCore } from 'react-draggable';
import styles from './styles.less';
import { getIconNameForComponent, getStylesForType } from './styles';
import './icon.less';

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
    if (!this.hasDrag && this.props.dispatch) {
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
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'work_canvas/moveComponentAndDisplaySettingsIfNeeded',
        component: this.props.model,
        deltaX: draggableData.deltaX,
        deltaY: draggableData.deltaY,
        originX: this.props.model.x,
        originY: this.props.model.y,

      });
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'work_canvas/openContextMenu',
        component: this.props.model,
        x: e.clientX,
        y: e.clientY,
      });
    }
  }

  render() {
    const { name, id, code, type } = this.props.model;
    const { x, y, height, width } =
      this.props.componentDict === undefined ?
        this.props.model : this.props.componentDict[id];
    const icon = getIconNameForComponent(code);
    return (
      <React.Fragment>
        <DraggableCore
          onStop={this.handleDragStop}
          onDrag={this.handleDrag}
          onStart={this.handleDragStart}
        >
          <div
            style={{
            width: `${width}px`,
            height: `${height}px`,
            background: `${getStylesForType(type, code)}`,
            transform: `translate(${x}px, ${y}px)`,
           }}
            onContextMenu={this.handleContextMenu}
            className={styles.nodeDiv}
          >
            <div
              className={styles.errorTip}
            >!
            </div>

            <div
              className={styles.infoTip}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            >i
            </div>
            <i className={`${icon} x-icon`} />
            {name}
          </div>
        </DraggableCore>
      </React.Fragment>
    );
  }
}

export default NodeLayer;
