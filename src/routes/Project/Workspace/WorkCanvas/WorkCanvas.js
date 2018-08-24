import React from 'react';
import { Spin, Modal } from 'antd';
import { connect } from 'dva';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
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
    // only deals with under select mode.
    if (this.state.mode === 'select') {
      // get rect size.
      const { startX, startY, stopX, stopY } = this.state.draggingSelection;

      const { canvas } = this.props.workcanvas;
      // calculate selected components.
      const { xMin, xMax } = startX > stopX ?
        { xMin: stopX, xMax: startX } : { xMin: startX, xMax: stopX };
      const { yMin, yMax } = startY > stopY ?
        { yMin: stopY, yMax: startY } : { yMin: startY, yMax: stopY };
      const selections = canvas.getSelectionInRange(xMin, yMin, xMax, yMax);
      if (!canvas.isCurrentSelection(selections)) {
        canvas.apply(new SelectionChange(selections));
        this.triggerUpdate(canvas);
      }
      // reset && trigger update.
      this.setState({ draggingSelection: {
        ...this.state.draggingSelection,
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
    if (key.isPressed('space')) {
      this.setState({
        mode: 'move',
      });
    } else {
      this.setState({
        mode: 'select',
      });
    }
  }

  handleSettingsClicked(component) {
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
        dispatch({
          type: 'work_component_settings/displayComponentSetting',
          payload: {
            component,
            projectId,
          },
        });
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

  handleCanvasMouseWheel(e) {
    if (key.isPressed('space')) {
      const { deltaX, deltaY } = e;
      const maxDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      const delta = maxDelta > 0 ? 0.1 : -0.1;
      const { canvas } = this.props.workcanvas;
      let newScale = delta + canvas.scale;
      if (newScale > 1.1) newScale = 1.1;
      if (newScale < 0.5) newScale = 0.5;
      canvas.apply(new ScaleChange(newScale));
      this.triggerUpdate(canvas);
    }
  }

  triggerUpdate(canvas) {
    this.props.dispatch({
      type: 'workcanvas/triggerCanvasUpdate',
      payload: { canvas },
    });
  }

  render() {
    const { state: { projectId }, canvas, validation, contextmenu } = this.props.workcanvas;
    const { mode } = this.state;
    if (canvas === undefined) return null;
    const { componentPositionCache, componentSocketPositionCache } = canvas;
    let contextMenuView = null;
    if (contextmenu.show) {
      const { component } = contextmenu;
      contextMenuView = (
        <ContextMenu
          {...contextmenu}
          onSettingsClicked={() => this.handleSettingsClicked(component)}
          onInspectClicked={() => this.handleInspectClicked(component)}
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
              cursor: mode === 'move' ? 'move' : 'default',
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
                    onNodeClicked={c => this.handleSettingsClicked(c)}
                    // selection={selection}
                    projectId={projectId}
                    // offset={offset}
                    validation={validation[component.id]}
                    canvas={canvas}
                    isMoveMode={this.state.mode === 'move'}
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
        this.state.inspectData ? (
          <DataInspector
            visible={this.state.inspectData}
            component={this.state.component}
            projectId={projectId}
            onClose={e => this.setState({ inspectData: false, component: undefined })}
          />
        ) : null
      }
      </div>
    );
  }
}
