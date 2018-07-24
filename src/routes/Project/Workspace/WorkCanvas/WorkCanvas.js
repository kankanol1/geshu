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
import DataInspector from './DataInspector';
import DraggingLineView from './DraggingLineView';
import DraggingSelectionView from './DraggingSelectionView';
import CanvasDraggingMove from '../../../../obj/workspace/op/CanvasDraggingMove';
import { addEvent } from '../../../../utils/utils';
import SelectionChange from '../../../../obj/workspace/op/SelectionChange';
import ComponentDelete from '../../../../obj/workspace/op/ComponentDelete';
import ConnectionDelete from '../../../../obj/workspace/op/ConnectionDelete';
import BatchOperation from '../../../../obj/workspace/op/BatchOperation';

const a = 0;
@connect(({ workcanvas, loading }) => ({
  workcanvas,
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
    addEvent(document, 'keyup', (event) => {
      // space
      if (event.keyCode === 32) {
        this.setState({ mode: 'select' });
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
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    const { deltaX, deltaY } = draggableData;
    const { canvas } = this.props.workcanvas;
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
            stopX: deltaX + e.offsetX,
            stopY: deltaY + e.offsetY,
          } });
        } else {
          this.setState({ draggingSelection: {
            dragging: true,
            startX,
            startY,
            stopX: deltaX + stopX,
            stopY: deltaY + stopY,
          } });
        }
        break;
      }
      case 'move': {
        const { offset } = canvas;
        canvas.apply(new CanvasDraggingMove(offset.x + deltaX, offset.y + deltaY));
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
    const { state: { projectId } } = this.props.workcanvas;
    const newSelection = [{
      type: 'component',
      id: component.id,
    }];
    this.props.dispatch({
      type: 'workcanvas/canvasSelectionChange',
      payload: {
        newSelection,
      },
    });
    this.props.dispatch({
      type: 'work_component_settings/displayComponentSetting',
      payload: {
        component,
        projectId,
      },
    });
    this.props.dispatch({
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
                    // selection={selection}
                    projectId={projectId}
                    // offset={offset}
                    validation={validation[component.id]}
                    canvas={canvas}
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
