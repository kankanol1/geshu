import React from 'react';
import { Spin, Modal } from 'antd';
import { connect } from 'dva';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
import { routerRedux } from 'dva/router';
import NodeLayer from './NodeLayer';
import PointLayer from './PointLayer';
import LineLayer from './LineLayer';
import SelectionLayer from './SelectionLayer';
import ContextMenu from './ContextMenu';
import styles from './WorkCanvas.less';
import DataInspector from './DataInspector';
import DraggingLineView from './DraggingLineView';
import DraggingSelectionView from './DraggingSelectionView';
import CanvasDraggingMove from '../../../../obj/workspace/op/CanvasDraggingMove';
import { addEvent } from '../../../../utils/utils';
import SelectionChange from '../../../../obj/workspace/op/SelectionChange';
import ScaleChange from '../../../../obj/workspace/op/ScaleChange';
import SubmitPipelineModal from '../Menu/SubmitPipelineModal';

const keyUpListener = [];
const keyDownLisener = [];
addEvent(document, 'keyup', (event) => {
  // space
  if (keyUpListener.length > 0) {
    keyUpListener.forEach(f => f(event));
  }
});
addEvent(document, 'keydown', (event) => {
  // space
  if (keyDownLisener.length > 0) {
    keyDownLisener.forEach(f => f(event));
  }
});

@connect(({ workcanvas, work_component_settings, loading }) => ({
  workcanvas,
  work_component_settings,
  loading,
}))
export default class WorkCanvas extends React.Component {
  state={
    inspectData: false,
    component: {
      name: '组件测试',
      outputs: [
        {
          id: 'o1',
        },
        {
          id: '02',
        },
      ],
    },
    draggingSelection: {
      dragging: false,
      startX: 0,
      startY: 0,
      stopX: 0,
      stopY: 0,
    },
    mode: 'select',
    opMode: 'select',
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // delete selection.
    key('delete, backspace', (e) => {
      e.preventDefault();
      dispatch({
        type: 'workcanvas/canvasDeleteSelected',
      });
    });
    // select all.
    key('⌘+a, ctrl+a', (e) => {
      e.preventDefault();
      return dispatch({
        type: 'workcanvas/canvasSelectAll',
      });
    });
    // save project.
    key('⌘+s, ctrl+s', (e) => {
      e.preventDefault();
      return dispatch({
        type: 'workcanvas/saveProject',
        payload: {
          showMessage: true,
        },
      });
    });
    // undo
    key('⌘+z, ctrl+z', (e) => {
      e.preventDefault();
      dispatch({
        type: 'workcanvas/canvasUndo',
      });
    });

    // redo
    key('⌘+y, ctrl+y', (e) => {
      e.preventDefault();
      dispatch({
        type: 'workcanvas/canvasRedo',
      });
    });
    key('space', (e) => {
      // prevent default space press.
      e.preventDefault();
    });
    keyUpListener.push((event) => {
      if (event.keyCode === 32) {
        this.setState({ mode: 'select' });
      }
    });
    keyDownLisener.push((event) => {
      if (event.keyCode === 32) {
        this.setState({ mode: 'move' });
      }
    });

    this.fetchJobTips();
    // start fetch job tips.
    this.intervalTask = setInterval(() => {
      this.fetchJobTips();
    }, 60000);
  }

  componentWillReceiveProps(nextProps) {
    const newMatch = nextProps.match;
    const { match } = this.props;
    if (match.params.id !== newMatch.params.id) {
      // load new canvas.
      this.props.dispatch({
        type: 'workcanvas/initProject',
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
    key.unbind('⌘+y, ctrl+y');
    key.unbind('⌘+z, ctrl+z');
    key.unbind('space');
    // clear listener.
    keyUpListener.length = 0;
    keyDownLisener.length = 0;

    if (this.intervalTask) {
      clearInterval(this.intervalTask);
    }
  }

  fetchJobTips = () => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'workcanvas/fetchJobTips',
      payload: {
        id: match.params.id,
      },
    });
  }


  handleDrag(e, draggableData) {
    e.preventDefault();
    const { deltaX, deltaY } = draggableData;
    const { canvas } = this.props.workcanvas;
    const scaleParam = 1 / canvas.scale;
    // update selection rect.
    switch (this.state.mode) {
      case 'select': {
        const { draggingSelection } = this.state;
        const { dragging, startX, startY, stopX, stopY } = draggingSelection;
        if (!dragging) {
          this.setState({ draggingSelection: {
            dragging: true,
            startX: e.offsetX,
            startY: e.offsetY,
            stopX: (deltaX * scaleParam) + e.offsetX,
            stopY: (deltaY * scaleParam) + e.offsetY,
          } });
        } else {
          this.setState({ draggingSelection: {
            dragging: true,
            startX,
            startY,
            stopX: (deltaX * scaleParam) + stopX,
            stopY: (deltaY * scaleParam) + stopY,
          } });
        }
        break;
      }
      case 'move': {
        const { offset } = canvas;
        canvas.apply(new CanvasDraggingMove(offset.x + (deltaX * scaleParam),
          offset.y + (deltaY * scaleParam)));
        this.triggerUpdate(canvas);
        break;
      }
      default:
        // eslint-disable-next-line
        console.log('error for mode:', this.state.mode);
        break;
    }
  }

  handleDragStop(e) {
    e.preventDefault();
    // only proceed under select mode.
    if (this.state.mode === 'select') {
      // get rect size.
      const { startX, startY, stopX, stopY } = this.state.draggingSelection;

      const { canvas } = this.props.workcanvas;
      // calculate selected components.
      const { xMin, xMax } = startX > stopX
        ? { xMin: stopX, xMax: startX } : { xMin: startX, xMax: stopX };
      const { yMin, yMax } = startY > stopY
        ? { yMin: stopY, yMax: startY } : { yMin: startY, yMax: stopY };
      const selections = canvas.getSelectionInRange(xMin, yMin, xMax, yMax);
      if (!canvas.isCurrentSelection(selections)) {
        canvas.apply(new SelectionChange(selections));
        this.triggerUpdate(canvas);
      }
      // reset && trigger update.
      this.setState({ draggingSelection: {
        dragging: false,
        startX: 0,
        startY: 0,
        stopX: 0,
        stopY: 0,
      } });
    }
    // cancel context menu if event caught.
    this.props.dispatch({
      type: 'workcanvas/hideContextMenu',
    });
  }

  handleDragStart(e) {
    e.preventDefault();
    // set mode.
    if (key.isPressed('space') || this.state.opMode === 'move') {
      this.setState({
        mode: 'move',
      });
    } else {
      this.setState({
        mode: 'select',
      });
    }
  }

  handleSettingsClicked(component, showSettings = false) {
    const { dispatch, workcanvas, work_component_settings } = this.props;
    const { state: { projectId }, canvas } = workcanvas;
    const { currentComponent, display: { dirty } } = work_component_settings;
    // get current selection.
    const lastSelected = canvas.getSelectedComponents();
    if (component.id !== currentComponent || lastSelected.length > 1) {
      // only process when it's not the same.
      const performChange = () => {
        const newSelection = [{
          type: 'component',
          id: component.id,
        }];

        dispatch({
          type: 'workcanvas/canvasSelectionChange',
          payload: {
            newSelection,
          },
        });
        if (showSettings) {
          dispatch({
            type: 'work_component_settings/displayComponentSetting',
            payload: {
              component,
              projectId,
            },
          });
        }
      };
      if (dirty) {
        Modal.confirm({
          title: '修改确认',
          content: '有未保存更改，是否确认切换设置组件？ 切换后未保存改动将无法恢复',
          onOk() {
            performChange();
          },
          onCancel() {
            // do nothing.
          },
        });
      } else {
        performChange();
      }
    }
    dispatch({
      type: 'workcanvas/hideContextMenu',
    });
  }

  handleInspectClicked(component) {
    this.setState({
      inspectData: true,
      component,
    });
    this.props.dispatch({
      type: 'workcanvas/hideContextMenu',
    });
  }

  handleRunToThisClicked(component) {
    this.props.dispatch({
      type: 'pipeline_submit/submitPipeline',
      payload: {
        id: this.props.match.params.id,
        sinkId: component.id,
      },
    });
    this.props.dispatch({
      type: 'workcanvas/hideContextMenu',
    });
  }

  handleCanvasMouseWheel(e) {
    if (key.isPressed('space')) {
      const { deltaX, deltaY } = e;
      const maxDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      const delta = maxDelta > 0 ? -0.1 : 0.1;
      this.handleCanvasScaleUpdate(delta);
    }
  }

  handleCanvasScaleUpdate(updateValue) {
    const { canvas } = this.props.workcanvas;
    let newScale = updateValue + canvas.scale;
    if (newScale > 1.1) newScale = 1.1;
    if (newScale < 0.5) newScale = 0.5;
    canvas.apply(new ScaleChange(newScale));
    this.triggerUpdate(canvas);
  }

  triggerUpdate(canvas) {
    this.props.dispatch({
      type: 'workcanvas/triggerCanvasUpdate',
      payload: { canvas },
    });
  }

  renderToolbarView() {
    const { canvas } = this.props.workcanvas;
    const { opMode } = this.state;
    if (!canvas) return null;
    const props = {
      className: 'iconfont',
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
    };

    return (
      <div className={styles.toolbarContainer}>
        <div className={styles.toolbar}>
          {
            opMode === 'select'
              ? <div><i {...props} onClick={() => this.setState({ opMode: 'move', mode: 'move' })}>&#xe615;</i></div>
              : <div><i {...props} onClick={() => this.setState({ opMode: 'select', mode: 'select' })}>&#xe68d;</i></div>
          }
          <div>
            <i
              {...props}
              onClick={(e) => {
                // zoom in.
                e.preventDefault();
                e.stopPropagation();
                this.handleCanvasScaleUpdate(0.1);
              }}
            >
            &#xe713;
            </i>
          </div>
          <div>
            <i
              {...props}
              onClick={(e) => {
                // zoom out.
                e.preventDefault();
                e.stopPropagation();
                this.handleCanvasScaleUpdate(-0.1);
              }}
            >
            &#xe714;
            </i>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { state: { projectId }, canvas, validation,
      contextmenu, jobTips } = this.props.workcanvas;
    const { mode, opMode } = this.state;
    if (canvas === undefined) return null;
    const { componentPositionCache, componentSocketPositionCache } = canvas;
    let contextMenuView = null;
    if (contextmenu.show) {
      const { component } = contextmenu;
      contextMenuView = (
        <ContextMenu
          {...contextmenu}
          onSettingsClicked={() => this.handleSettingsClicked(component, true)}
          onInspectClicked={() => this.handleInspectClicked(component)}
          onRunToThisClicked={() => this.handleRunToThisClicked(component)}
        />
      );
    }

    // calculate viewpoint.
    const displaySize = (1 / canvas.scale) * 100;
    const displayOffset = (100 - displaySize) / 2;
    const viewPort = {
      width: `${displaySize}%`,
      height: `${displaySize}%`,
      top: `${displayOffset}%`,
      left: `${displayOffset}%`,
    };
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
            style={{
              cursor: opMode === 'move' || mode === 'move' ? 'move' : 'default',
              transform: `scale(${canvas.scale})`,
              overflow: 'hidden',
              ...viewPort,
            }}
            className="work-canvas"
            onWheel={e => this.handleCanvasMouseWheel(e)}
          >
            {
          canvas.components.map(
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
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    onCanvasUpdated={c => this.triggerUpdate(c)}
                    // selection={selection}
                    projectId={projectId}
                    // offset={offset}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                  />
                  {
                  /* 2. node layer */
                  }
                  <NodeLayer
                    key={`node-${i}`}
                    model={component}
                    dispatch={this.props.dispatch}
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    onCanvasUpdated={c => this.triggerUpdate(c)}
                    onNodeClicked={(c, flag) => this.handleSettingsClicked(c, flag)}
                    // selection={selection}
                    projectId={projectId}
                    // offset={offset}
                    validation={validation[component.id]}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                    jobTips={jobTips[component.id]}
                    // handle job clicked.
                    onJobStatusClicked={(job) => {
                      if (job.status === 'finished') {
                        // add pane.
                        this.props.dispatch({
                          type: 'outputview/addPane',
                          payload: {
                            id: job.id,
                            type: 'job',
                            title: `作业详细[${job.id}]`,
                          },
                        });
                      } else {
                        // go to job list.
                        this.props.dispatch({
                          type: 'outputview/activePane',
                          payload: {
                            title: 'default',
                          },
                        });
                      }
                      // redirect.
                      this.props.dispatch(routerRedux.push(`/project/workspace/output/${projectId}`));
                    }}
                  />
                  {
                    /* 3. point layer */
                  }
                  <PointLayer
                    key={`point-${i}`}
                    model={component}
                    dispatch={this.props.dispatch}
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    // selection={selection}
                    projectId={projectId}
                    lineDraggingState={this.props.workcanvas.runtime.lineDraggingState}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                    // offset={offset}
                  />
                </React.Fragment>
              );
            }
          )
        }
            {
            /* 4. selection layer */
              <SelectionLayer
                selection={canvas.selection}
                positionDict={componentSocketPositionCache}
                componentDict={componentPositionCache}
              />
          }
            {

              /* 5. dragging line view */
              <DraggingLineView
                lineDraggingState={this.props.workcanvas.runtime.lineDraggingState}
              />
            }
            {
              /* 6. dragging selection view */
              <DraggingSelectionView
                draggingSelection={this.state.draggingSelection}
              />
            }
          </div>
        </DraggableCore>
        {
          contextMenuView
        }
        {
          this.renderToolbarView()
        }
        {
        this.state.inspectData ? (
          <DataInspector
            visible={this.state.inspectData}
            component={this.state.component}
            projectId={projectId}
            onClose={e => this.setState({ inspectData: false, component: undefined })}
          />
        ) : null
      }
        {
          <SubmitPipelineModal id={projectId} />
      }
      </div>
    );
  }
}
