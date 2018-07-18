import React from 'react';
import { DraggableCore } from 'react-draggable';
import { Icon, Modal } from 'antd';
import styles from './styles.less';
import { getIconNameForComponent, getStylesForType, componentSize } from './styles';
import './icon.less';

/**
 * Node Layer: the bottom/first layer of the work canvas.
 * Only draw the nodes.
 */
class NodeLayer extends React.Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.hasDrag = true;
    this.projectId = undefined;
    this.offsetCache = undefined;
    this.validationCache = undefined;
  }

  shouldComponentUpdate() {
    const newProjectId = this.props.projectId;
    if (newProjectId !== this.projectId) {
      this.projectId = newProjectId;
      return true;
    } else if (!this.offsetCache || this.offsetCache !== this.props.offset) {
      this.offsetCache = this.props.offset;
      return true;
    }
    // only update when selected.
    const { selection, model, validation } = this.props;
    if (selection) {
      const selected = selection.filter(s => s.id === model.id).length > 0;
      if (selected) {
        return selected;
      } else {
        const result = validation === this.validationCache;
        this.validationCache = validation;
        return result;
      }
    } else {
      // used by preview.
      return true;
    }
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

  displayValidation = (validation) => {
    if (validation.errors) {
      Modal.error({
        title: '错误提示',
        content: [
          validation.errors.map((e, i) => <span key={`e-${i}`}>{e}</span>),
          validation.warns && validation.warns.map((e, i) => <span key={`w-${i}`}>{e}</span>),
        ],
      });
    } else {
      Modal.warning({
        title: '警告',
        content: [
          validation.warns.map((e, i) => <span key={`w-${i}`}>{e}</span>),
        ],
      });
    }
  }

  render() {
    const { name, id, code, type } = this.props.model;
    const { x, y } =
      this.props.componentDict === undefined ?
        this.props.model : this.props.componentDict[id];
    const icon = getIconNameForComponent(code);
    const { validation } = this.props;
    let errorDisplay;
    if (validation) {
      errorDisplay = validation.errors ? 'error' : 'warn';
    }
    let nodeClassName = styles.nodeDiv;
    if (errorDisplay) {
      nodeClassName = errorDisplay === 'error' ? styles.nodeDivError : styles.nodeDivWarn;
    }
    return (
      <React.Fragment>
        {
          errorDisplay ? (
            <div style={{ width: '0px', height: '0px', transform: `translate(${x + componentSize.width + 4}px, ${y}px)` }}>
              <Icon
                type="warning"
                className={errorDisplay === 'error' ? styles.errorTip : styles.warnTip}
                onClick={() => this.displayValidation(validation)}
              />
            </div>
          ) : null
        }
        <DraggableCore
          onStop={this.handleDragStop}
          onDrag={this.handleDrag}
          onStart={this.handleDragStart}
        >
          <div
            style={{
            width: `${componentSize.width}px`,
            height: `${componentSize.height}px`,
            background: `${getStylesForType(type, code)}`,
            transform: `translate(${x}px, ${y}px)`,
           }}
            onContextMenu={this.handleContextMenu}
            className={nodeClassName}
          >
            {/* <div
              className={styles.errorTip}
            >!
            </div>

            <div
              className={styles.infoTip}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            >i
            </div> */}
            <i className={`${icon} x-icon`} />
            {name}
          </div>
        </DraggableCore>
      </React.Fragment>
    );
  }
}

export default NodeLayer;
