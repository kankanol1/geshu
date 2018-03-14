import React from 'react';
import { connect } from 'dva';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
import NodeLayer from './NodeLayer';
import PointLayer from './PointLayer';
import LineLayer from './LineLayer';
import SelectionLayer from './SelectionLayer';
import ContextMenu from './ContextMenu';
import './WorkCanvas.less';

class WorkCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'work_canvas/init',
    });
    // add key listener.

    key('del, delete', () => {
      return dispatch({
        type: 'work_canvas/deleteCurrentSelection',
      });
    });
    key('⌘+a, ctrl+a', (e) => {
      e.preventDefault();
      return dispatch({
        type: 'work_canvas/selectAll',
      });
    });
  }

  componentWillUnmount() {
    key.unbind('del, delete');
    key.unbind('⌘+a, ctrl+a');
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    // update selection rect.
    this.props.dispatch({
      type: 'work_canvas/dragCanvas',
      startX: e.offsetX,
      startY: e.offsetY,
      currentX: draggableData.deltaX,
      currentY: draggableData.deltaY,
    });
  }

  handleDragStop(e) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/canvasDragStop',
    });
  }

  handleDragStart(e) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/modeChange',
      isMoveMode: key.isPressed('space'),
    });
  }


  render() {
    // 1. generate position reference table for the rest calculation.
    // store: componentid: {x, y}
    const { componentDict } = this.props.cache;
    // store: componentid: {pointid: {x, y}}
    const componentPointPosition = this.props.cache.pointDict;
    // avoid first render. we need to wait for the cache ready.
    if (Object.keys(componentDict).length === 0) return null;

    let contextMenuView = null;
    if (this.props.contextmenu.show) {
      const { x, y } = this.props.contextmenu;
      contextMenuView = (<ContextMenu top={y} left={x} />);
    }

    return (
      <div style={{ width: '100%', height: '99%' }}>
        <DraggableCore
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}
          onStart={this.handleDragStart}
        >
          <svg
            style={{ width: '100%',
            height: '100%',
            cursor: this.props.mode === 'move' ? 'move' : 'default' }}
            className="work-canvas"
          >
            {
              /* 1. node layer */
              this.props.components.map(
                (component, i) => {
                  return (
                    <NodeLayer
                      key={i}
                      model={component}
                      dispatch={this.props.dispatch}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                    />
                  );
                }
              )
            }
            {
              /* 2. line layer */
              this.props.components.map(
                (component, i) => {
                  return (
                    <LineLayer
                      key={i}
                      model={component}
                      dispatch={this.props.dispatch}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                    />);
                }
              )
            }
            {
              /* 3. point layer */
              this.props.components.map(
                (component, i) => {
                  return (
                    <PointLayer
                      key={i}
                      model={component}
                      dispatch={this.props.dispatch}
                      draggingTarget={this.props.lineDraggingState.draggingTarget}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                    />
                  );
                }
              )
            }
            {
              /* 4. selection layer */
              <SelectionLayer
                {...this.props}
                positionDict={componentPointPosition}
                componentDict={componentDict}
              />
            }
          </svg>
        </DraggableCore>
        {
          contextMenuView
        }
      </div>
    );
  }
}


export default connect(({ work_canvas }) => work_canvas)(WorkCanvas);
