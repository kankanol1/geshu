import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
import NodeLayer from './NodeLayer';
import PointLayer from './PointLayer';
import LineLayer from './LineLayer';
import SelectionLayer from './SelectionLayer';
import DraggingSelectionView from './DraggingSelectionView';
import ContextMenu from './ContextMenu';
import styles from './WorkCanvas.less';
// import DataInspector from './DataInspector';
// import DraggingLineView from './DraggingLineView';
// import DraggingSelectionView from './DraggingSelectionView';
import CanvasDraggingMove from '@/obj/workspace/op/CanvasDraggingMove';
import { addEvent } from '@/utils/utils';
import SelectionChange from '@/obj/workspace/op/SelectionChange';
import ScaleChange from '@/obj/workspace/op/ScaleChange';
import IOConfig from '../Configs/IO/Index';
import DataInspector from './DataInspector';
import SchemaInspector from './SchemaInspector';
import SaveDataset from './SaveDataset';
import LogView from './LogView';

const keyUpListener = [];
const keyDownLisener = [];
addEvent(document, 'keyup', event => {
  // space
  if (keyUpListener.length > 0) {
    keyUpListener.forEach(f => f(event));
  }
});
addEvent(document, 'keydown', event => {
  // space
  if (keyDownLisener.length > 0) {
    keyDownLisener.forEach(f => f(event));
  }
});

@connect(({ dataproPipeline, loading }) => ({
  dataproPipeline,
  loading: loading.effects['dataproPipeline/loadPipeline'],
}))
class WorkCanvas extends React.Component {
  state = {
    draggingSelection: {
      dragging: false,
      startX: 0,
      startY: 0,
      stopX: 0,
      stopY: 0,
    },
    mode: 'select',
    opMode: 'select',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // delete selection.
    key('delete, backspace', e => {
      e.preventDefault();
      dispatch({
        type: 'dataproPipeline/canvasDeleteSelected',
      });
    });
    // select all.
    key('⌘+a, ctrl+a', e => {
      e.preventDefault();
      return dispatch({
        type: 'dataproPipeline/canvasSelectAll',
      });
    });
    // save project.
    key('⌘+s, ctrl+s', e => {
      e.preventDefault();
      return dispatch({
        type: 'dataproPipeline/saveProject',
        payload: {
          showMessage: true,
        },
      });
    });
    key('space', e => {
      // prevent default space press.
      e.preventDefault();
    });
    keyUpListener.push(event => {
      if (event.keyCode === 32) {
        this.setState({ mode: 'select' });
      }
    });
    keyDownLisener.push(event => {
      if (event.keyCode === 32) {
        this.setState({ mode: 'move' });
      }
    });
    dispatch({
      type: 'dataproPipeline/loadPipeline',
      payload: {
        id: this.props.id,
      },
    });
  }

  componentWillUnmount() {
    key.unbind('delete, backspace');
    key.unbind('⌘+a, ctrl+a');
    key.unbind('⌘+s, ctrl+s');
    key.unbind('space');
    // clear listener.
    keyUpListener.length = 0;
    keyDownLisener.length = 0;

    if (this.intervalTask) {
      clearInterval(this.intervalTask);
    }
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    const { deltaX, deltaY } = draggableData;
    const { canvas } = this.props.dataproPipeline;
    const scaleParam = 1 / canvas.scale;
    // update selection rect.
    switch (this.state.mode) {
      case 'select': {
        const { draggingSelection } = this.state;
        const { dragging, startX, startY, stopX, stopY } = draggingSelection;
        if (!dragging) {
          this.setState({
            draggingSelection: {
              dragging: true,
              startX: e.offsetX,
              startY: e.offsetY,
              stopX: deltaX * scaleParam + e.offsetX,
              stopY: deltaY * scaleParam + e.offsetY,
            },
          });
        } else {
          this.setState({
            draggingSelection: {
              dragging: true,
              startX,
              startY,
              stopX: deltaX * scaleParam + stopX,
              stopY: deltaY * scaleParam + stopY,
            },
          });
        }
        break;
      }
      case 'move': {
        const { offset } = canvas;
        canvas.apply(
          new CanvasDraggingMove(offset.x + deltaX * scaleParam, offset.y + deltaY * scaleParam)
        );
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

      const { canvas } = this.props.dataproPipeline;
      // calculate selected components.
      const { xMin, xMax } =
        startX > stopX ? { xMin: stopX, xMax: startX } : { xMin: startX, xMax: stopX };
      const { yMin, yMax } =
        startY > stopY ? { yMin: stopY, yMax: startY } : { yMin: startY, yMax: stopY };
      const selections = canvas.getSelectionInRange(xMin, yMin, xMax, yMax);
      if (!canvas.isCurrentSelection(selections)) {
        canvas.apply(new SelectionChange(selections));
        this.triggerUpdate(canvas);
      }
      // reset && trigger update.
      this.setState({
        draggingSelection: {
          dragging: false,
          startX: 0,
          startY: 0,
          stopX: 0,
          stopY: 0,
        },
      });
    } else {
      const { canvas } = this.props.dataproPipeline;
      this.handleUpdateFinished(canvas);
    }
    // cancel context menu if event caught.
    this.props.dispatch({
      type: 'dataproPipeline/hideContextMenu',
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

  handleOperatorClicked(component) {
    const {
      dispatch,
      dataproPipeline: { canvas },
    } = this.props;
    // get current selection.
    const lastSelected = canvas.getSelectedComponents();
    if (lastSelected.length !== 1 || lastSelected[0].id !== component.id) {
      // only process when it's not the same.
      const performChange = () => {
        const newSelection = [
          {
            type: 'component',
            id: component.id,
          },
        ];

        dispatch({
          type: 'dataproPipeline/canvasSelectionChange',
          payload: {
            newSelection,
          },
        });
      };
      performChange();
    }
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
    const { canvas } = this.props.dataproPipeline;
    let newScale = updateValue + canvas.scale;
    if (newScale > 1.1) newScale = 1.1;
    if (newScale < 0.5) newScale = 0.5;
    canvas.apply(new ScaleChange(newScale));
    this.handleUpdateFinished(canvas);
  }

  triggerUpdate(canvas) {
    this.props.dispatch({
      type: 'dataproPipeline/triggerCanvasUpdate',
      payload: { canvas },
    });
  }

  handleUpdateFinished(canvas) {
    this.props.dispatch({
      type: 'dataproPipeline/updateCanvas',
      payload: { canvas, projectId: this.props.id },
    });
  }

  renderToolbarView() {
    const { canvas } = this.props.dataproPipeline;
    const { opMode } = this.state;
    if (!canvas) return null;
    const props = {
      className: 'iconfont',
      onDoubleClick: e => {
        e.preventDefault();
        e.stopPropagation();
      },
    };

    return (
      <div className={styles.toolbarContainer}>
        <div className={styles.toolbar}>
          {opMode === 'select' ? (
            <div>
              <i {...props} onClick={() => this.setState({ opMode: 'move', mode: 'move' })}>
                &#xe615;
              </i>
            </div>
          ) : (
            <div>
              <i {...props} onClick={() => this.setState({ opMode: 'select', mode: 'select' })}>
                &#xe68d;
              </i>
            </div>
          )}
          <div>
            <i
              {...props}
              onClick={e => {
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
              onClick={e => {
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

  renderModifyingComponent = component => {
    const { canvas } = this.props.dataproPipeline;
    // get output dataset names
    const datasetIdNames = {};
    canvas.components.forEach(i => {
      datasetIdNames[i.id] = i.name;
    });
    const newInputs = [];
    // get input.
    component.connections.forEach(i => {
      newInputs.push(datasetIdNames[i.component]);
    });
    // only one output.
    const newOutputs = [];
    canvas.components.forEach(i => {
      if (
        i.connections &&
        i.connections.length === 1 &&
        i.connections[0].component === component.id
      ) {
        newOutputs.push(datasetIdNames[i.id]);
      }
    });
    return (
      <IOConfig
        type="modify"
        id={this.props.id}
        title={`修改组件：${component.name}`}
        component={{ ...component, inputs: newInputs, outputs: newOutputs }}
        onOk={() => {
          this.props.dispatch({
            type: 'dataproPipeline/loadPipeline',
            payload: {
              id: this.props.id,
            },
          });
          this.props.dispatch({
            type: 'dataproPipeline/modifyComponent',
            payload: {
              component: undefined,
            },
          });
        }}
        onCancel={() =>
          this.props.dispatch({
            type: 'dataproPipeline/modifyComponent',
            payload: {
              component: undefined,
            },
          })
        }
      />
    );
  };

  render() {
    const { id: projectId, loading } = this.props;
    if (loading) {
      return (
        <div style={{ height: '100px', textAlign: 'center', lineHeight: '40' }}>
          <Spin size="large" />
        </div>
      );
    }
    const {
      // state: { projectId },
      canvas,
      inspecting,
      inspectingSchema,
      contextmenu,
      modifyingComponent,
      status,
      savingDataset,
    } = this.props.dataproPipeline;
    const { mode, opMode } = this.state;
    if (canvas === undefined) return null;
    const { componentPositionCache, componentSocketPositionCache } = canvas;
    let contextMenuView = null;
    if (contextmenu.show) {
      contextMenuView = (
        <ContextMenu
          dispatch={this.props.dispatch}
          {...contextmenu}
          projectId={projectId}
          status={status}
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
      <div className={styles.workCanvasWrapper}>
        <DraggableCore
          onDrag={(e, data) => this.handleDrag(e, data)}
          onStop={e => this.handleDragStop(e)}
          onStart={e => this.handleDragStart(e)}
        >
          <div
            style={{
              cursor: opMode === 'move' || mode === 'move' ? 'move' : 'default',
              transform: `scale(${canvas.scale})`,
              // overflow: 'hidden',
              position: 'absolute',
              ...viewPort,
            }}
            className="work-canvas"
            onWheel={e => this.handleCanvasMouseWheel(e)}
          >
            {canvas.components.map((component, i) => {
              return (
                <React.Fragment key={`f-${i}`}>
                  {/* 1. line layer, contains svg. needs to be at bottom */}
                  <LineLayer
                    key={`line-${i}`}
                    model={component}
                    dispatch={this.props.dispatch}
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    onCanvasUpdated={c => this.triggerUpdate(c)}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                  />
                  {/* 2. node layer */}
                  <NodeLayer
                    key={`node-${i}`}
                    model={component}
                    dispatch={this.props.dispatch}
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    onCanvasUpdated={c => this.triggerUpdate(c)}
                    onCanvasUpdateFinished={c => this.handleUpdateFinished(c)}
                    onNodeClicked={(c, flag) => this.handleOperatorClicked(c, flag)}
                    // selection={selection}
                    projectId={projectId}
                    // offset={offset}
                    status={status[component.id]}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                  />
                  {/* 3. point layer */}
                  <PointLayer
                    key={`point-${i}`}
                    model={component}
                    dispatch={this.props.dispatch}
                    positionDict={componentSocketPositionCache}
                    componentDict={componentPositionCache}
                    projectId={projectId}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
                  />
                </React.Fragment>
              );
            })}
            {
              /* 4. selection layer */
              <SelectionLayer
                selection={canvas.selection}
                positionDict={componentSocketPositionCache}
                componentDict={componentPositionCache}
              />
            }
            {
              /* 6. dragging selection view */
              <DraggingSelectionView draggingSelection={this.state.draggingSelection} />
            }
          </div>
        </DraggableCore>
        {contextMenuView}
        {this.renderToolbarView()}
        {<LogView />}
        {modifyingComponent && this.renderModifyingComponent(modifyingComponent)}

        {inspecting && (
          <DataInspector
            visible={inspecting && true}
            component={inspecting}
            projectId={projectId}
            onClose={e =>
              this.props.dispatch({
                type: 'dataproPipeline/setInspectingComponent',
                payload: {
                  component: undefined,
                },
              })
            }
          />
        )}
        {inspectingSchema && (
          <SchemaInspector
            visible={inspectingSchema && true}
            component={inspectingSchema}
            projectId={projectId}
            onClose={e =>
              this.props.dispatch({
                type: 'dataproPipeline/setInspectingSchema',
                payload: {
                  component: undefined,
                },
              })
            }
          />
        )}
        {// saving dataset.
        savingDataset && (
          <SaveDataset
            dataset={savingDataset}
            projectId={projectId}
            onDismiss={() =>
              this.props.dispatch({
                type: 'dataproPipeline/updateSavingDataset',
                payload: {
                  dataset: undefined,
                },
              })
            }
          />
        )}
      </div>
    );
  }
}

export default WorkCanvas;
