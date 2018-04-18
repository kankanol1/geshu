import React from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
import NodeLayer from './NodeLayer';
import PointLayer from './PointLayer';
import LineLayer from './LineLayer';
import SelectionLayer from './SelectionLayer';
import ContextMenu from './ContextMenu';
import './WorkCanvas.less';

@connect(({ work_canvas, loading }) => ({
  work_canvas,
  loading,
}))
export default class WorkCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { state } = this.props.work_canvas;
    const maxRefreshTime = 1000 * 60 * 60;
    if (state.projectId === undefined
        || state.projectId !== match.params.id
        || Date.now() - state.lastSync > maxRefreshTime) {
      // only call init if project id not match or last sync is too long.
      dispatch({
        type: 'work_canvas/init',
        payload: {
          id: match.params.id,
        },
      });
    }
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
    key('⌘+s, ctrl+s', (e) => {
      e.preventDefault();
      console.log('save');
      return dispatch({
        type: 'work_canvas/saveComponents',
        payload: {
          id: match.params.id,
        },
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const newMatch = nextProps.match;
    const { match } = this.props;
    if (match.params.id !== newMatch.params.id) {
      // load new canvas.
      this.props.dispatch({
        type: 'work_canvas/init',
        payload: {
          id: newMatch.params.id,
        },
      });
    }
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

  handleSettingsClicked(component) {
    this.props.dispatch({
      type: 'work_canvas/updateComponentSelectionAndDisplaySettings',
      component,
    });
  }

  render() {
    // 1. generate position reference table for the rest calculation.
    // store: componentid: {x, y}
    const { componentDict } = this.props.work_canvas.cache;
    // store: componentid: {pointid: {x, y}}
    const componentPointPosition = this.props.work_canvas.cache.pointDict;

    const { contextmenu } = this.props.work_canvas;
    let contextMenuView = null;
    if (contextmenu.show) {
      const { x, y, component } = contextmenu;
      contextMenuView = (
        <ContextMenu
          top={y}
          left={x}
          onSettingsClicked={() => this.handleSettingsClicked(component)}
        />
      );
    }

    const { components, mode } = this.props.work_canvas;

    const isLoading = this.props.loading.effects['work_canvas/init'];

    return (
      <div style={{ width: '100%', display: 'auto' }}>
        <DraggableCore
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}
          onStart={this.handleDragStart}
        >
          <div
            style={{ width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flex: 'auto',
            cursor: mode === 'move' ? 'move' : 'default' }}
            className="work-canvas"
          >
            {
              /* 1. node layer */
              components.map(
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
              components.map(
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
              components.map(
                (component, i) => {
                  return (
                    <PointLayer
                      key={i}
                      model={component}
                      dispatch={this.props.dispatch}
                      draggingTarget={this.props.work_canvas.lineDraggingState.draggingTarget}
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
                {...this.props.work_canvas}
                positionDict={componentPointPosition}
                componentDict={componentDict}
              />
            }
          </div>
        </DraggableCore>
        {
          contextMenuView
        }
      </div>
    );
  }
}
