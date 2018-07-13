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
import styles from './WorkCanvas.less';

@connect(({ work_canvas, loading }) => ({
  work_canvas,
  loading,
}))
export default class WorkCanvas extends React.Component {
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
    key('delete, backspace', (e) => {
      e.preventDefault();
      return dispatch({
        type: 'work_canvas/deleteSelectedAndRemoveSettings',
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
    key.unbind('delete, backspace');
    key.unbind('⌘+a, ctrl+a');
    key.unbind('⌘+s, ctrl+s');
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

  // handleWheel(e) {
  //   e.preventDefault();
  //   if (key.isPressed('space')) {
  //     const { deltaX, deltaY } = e;
  //     const maxDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
  //     const { scale } = this.state;
  //     let newScale = (maxDelta / 1000) + scale;
  //     if (newScale < 0.5) {
  //       newScale = 0.5;
  //     } else if (newScale > 1.5) {
  //       newScale = 1.5;
  //     }
  //     this.setState({ scale: newScale });
  //   }
  // }

  render() {
    // 1. generate position reference table for the rest calculation.
    // store: componentid: {x, y}
    const { componentDict } = this.props.work_canvas.cache;
    // store: componentid: {pointid: {x, y}}
    const componentPointPosition = this.props.work_canvas.cache.pointDict;

    const { contextmenu, offset } = this.props.work_canvas;
    let contextMenuView = null;
    if (contextmenu.show) {
      const { component } = contextmenu;
      contextMenuView = (
        <ContextMenu
          {...contextmenu}
          onSettingsClicked={() => this.handleSettingsClicked(component)}
        />
      );
    }

    const { components, mode, selection, state: { projectId } } = this.props.work_canvas;

    const isLoading = this.props.loading.effects['work_canvas/init'];
    return (
      <div
        className={styles.workCanvasWrapper}
      >
        <DraggableCore
          onDrag={(e, data) => this.handleDrag(e, data)}
          onStop={e => this.handleDragStop(e)}
          onStart={e => this.handleDragStart(e)}
        >
          <div
            style={{ cursor: mode === 'move' ? 'move' : 'default' }}
            className="work-canvas"
            // onWheel={e => this.handleWheel(e)}
          >
            {
            components.map(
              (component, i) => {
                return (
                  <React.Fragment key={`f-${i}`}>
                    {
                      /* 1. line layer, contains svg. needs to be at bottom */
                     }
                    <LineLayer
                      key={`line-${i}`}
                      model={component}
                      dispatch={this.props.dispatch}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                      selection={selection}
                      projectId={projectId}
                      offset={offset}
                    />
                    {
                    /* 2. node layer */
                    }
                    <NodeLayer
                      key={`node-${i}`}
                      model={component}
                      dispatch={this.props.dispatch}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                      selection={selection}
                      projectId={projectId}
                      offset={offset}
                    />
                    {
                      /* 3. point layer */
                    }
                    <PointLayer
                      key={`point-${i}`}
                      model={component}
                      dispatch={this.props.dispatch}
                      draggingTarget={this.props.work_canvas.lineDraggingState.draggingTarget}
                      positionDict={componentPointPosition}
                      componentDict={componentDict}
                      selection={selection}
                      projectId={projectId}
                      offset={offset}
                    />
                  </React.Fragment>
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
