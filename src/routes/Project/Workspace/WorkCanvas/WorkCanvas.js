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
  loading: loading.models.work_canvas,
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
    dispatch({
      type: 'work_canvas/init',
      payload: {
        id: match.params.id,
      },
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
    // avoid first render. we need to wait for the cache ready.
    if (Object.keys(componentDict).length === 0) return null;

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
    const { loading } = this.props;
    // if (loading) {
    //   return (
    //     <div style={{ width: '100%', height: '99%', textAlign: 'center', paddingTop: '200px' }}>
    //       <Spin size="large" />
    //     </div>
    //   );
    // }

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


            {loading ?
                // add a rect to cover background.
              (
                <rect x={0} y={0} height="100%" width="100%" style={{ fill: 'white' }} />
              )
             : null}
            {loading ?
              (
                // loading spin
                <foreignObject x="0" y="0" width="100%" height="100%">
                  <Spin xmlns="http://www.w3.org/1999/xhtml" size="large" style={{ width: '100%', margin: 'auto', paddingTop: '200px' }} />
                </foreignObject>

              )
             : null}
          </svg>
        </DraggableCore>
        {
          contextMenuView
        }
      </div>
    );
  }
}
