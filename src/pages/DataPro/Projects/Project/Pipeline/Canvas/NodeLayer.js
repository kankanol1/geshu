import React from 'react';
import { DraggableCore } from 'react-draggable';
import { Icon, Modal, Tooltip } from 'antd';
import Link from 'umi/link';
import styles from './styles.less';
import { getIconNameForComponent, getStylesForType, componentSize } from './styles';
import './icon.less';
import ComponentDraggingMove from '@/obj/workspace/op/ComponentDraggingMove';
import ComponentMove from '@/obj/workspace/op/ComponentMove';
import BatchUntrackedOperation from '@/obj/workspace/op/BatchUntrackedOperation';
import BatchOperation from '@/obj/workspace/op/BatchOperation';
// import { calculateLineCurly } from '@/utils/PositionCalculation';

const jobTipDescription = {
  failed: '作业失败，点击查看',
  finished: '作业完成，点击查看',
  started: '作业运行中，点击查看',
  waiting: '作业运行中，点击查看',
  initialized: '作业运行中，点击查看',
  queued: '作业运行中，点击查看',
  canceled: '作业运行中，点击查看',
};

const jobTipIcons = {
  failed: 'close-circle',
  finished: 'check-circle',
  started: 'loading',
  waiting: 'loading',
  initialized: 'loading',
  queued: 'loading',
  canceled: 'loading',
};

const jobTipStyle = {
  failed: styles.taskFailedTip,
  finished: styles.taskFinishedTip,
  started: styles.taskRunningTip,
  waiting: styles.taskRunningTip,
  initialized: styles.taskRunningTip,
  queued: styles.taskRunningTip,
  canceled: styles.taskRunningTip,
};

/**
 * Node Layer: the bottom/first layer of the work canvas.
 * Only draw the nodes.
 */
class NodeLayer extends React.Component {
  constructor(props) {
    super(props);
    this.hasDrag = true;

    this.state = {
      draggingState: {
        startX: 0,
        startY: 0,
        stopX: 0,
        stopY: 0,
      },
      componentCache: [],
    };
  }

  shouldComponentUpdate() {
    // if (!this.props.model) return true;
    // const result = !this.lastUpdated || this.lastUpdated < this.props.model.updated;
    // if (result) this.lastUpdated = this.props.model.updated;
    return true;
  }

  handleDragStart(e) {
    // trigger canvas drag.
    if (this.props.isMoveMode) return false;
    e.preventDefault();
    // stop propagation to parent.
    e.stopPropagation();
    this.hasDrag = false;
    const { canvas } = this.props;
    const selection = canvas.getSelectedComponents();
    const component = this.props.model;
    // if not included,
    let componentCache = [];
    if (selection.filter(i => i.id === component.id).length === 0) {
      componentCache = [{ component, x: component.x, y: component.y }];
    } else {
      // move selected component.
      componentCache = selection.map(i => ({ component: i, x: i.x, y: i.y }));
    }
    this.setState({
      draggingState: {
        ...this.state.draggingState,
        startX: this.props.model.x,
        startY: this.props.model.y,
        stopX: this.props.model.x,
        stopY: this.props.model.y,
      },
      componentCache,
    });
  }

  handleDragStop(e) {
    e.preventDefault();
    // if not dragged, perform selection change.
    if (!this.hasDrag) {
      if (this.props.onNodeClicked) {
        this.props.onNodeClicked(this.props.model, false);
      }
    } else {
      const { canvas } = this.props;
      const { startX, startY, stopX, stopY } = this.state.draggingState;
      const batchMove = this.state.componentCache.map(
        i => new ComponentMove(i.component, i.x, i.y, i.x + stopX - startX, i.y + stopY - startY)
      );
      const move = new BatchOperation(batchMove);
      canvas.apply(move);
      this.setState({ componentCache: [] });
      this.props.onCanvasUpdated(canvas);
      this.props.onCanvasUpdateFinished(canvas);
    }
    // hide context menu if possible.
    this.props.dispatch({
      type: 'workcanvas/hideContextMenu',
    });
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    const { deltaX, deltaY } = draggableData;
    if (deltaX !== 0 || deltaY !== 0) {
      this.hasDrag = true;
      const { canvas } = this.props;
      const scaleParam = 1 / canvas.scale;
      const { startX, startY, stopX: lastStopX, stopY: lastStopY } = this.state.draggingState;
      const stopX = lastStopX + deltaX * scaleParam;
      const stopY = lastStopY + deltaY * scaleParam;
      const batchMove = this.state.componentCache.map(
        i => new ComponentDraggingMove(i.component, i.x + stopX - startX, i.y + stopY - startY)
      );
      const move = new BatchUntrackedOperation(batchMove);
      canvas.apply(move);
      this.setState({
        draggingState: {
          ...this.state.draggingState,
          stopX,
          stopY,
        },
      });
      this.props.onCanvasUpdated(canvas);
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'dataproPipeline/openContextMenu',
        component: this.props.model,
        x: e.clientX,
        y: e.clientY,
      });
    }
  }

  render() {
    const { projectId } = this.props;
    const { name, id, code, type } = this.props.model;
    // console.log('model', this.props.model);
    const { x, y } =
      this.props.componentDict === undefined ? this.props.model : this.props.componentDict[id];
    const icon = getIconNameForComponent(code);
    const { status: rawStatus } = this.props;
    const status = rawStatus && rawStatus.status;
    const nodeClassName = status === 'ERROR' ? styles.nodeDivError : styles.nodeDiv;
    let extraStyle = null;
    if (type === 'Dataset') {
      extraStyle = styles.datasetDiv;
      switch (status) {
        case 'EMPTY':
        case 'CALCULATING':
          extraStyle = styles.datasetEmptyDiv;
          break;
        case 'CALCULATED_ERROR':
          extraStyle = styles.datasetErrorDiv;
          break;
        case 'CALCULATED':
        default:
          break;
      }
    } else if (type === 'Schema') {
      extraStyle = styles.datasetDiv;
    }
    return (
      <React.Fragment>
        {status !== 'READY' && (
          <div
            style={{
              width: '0px',
              height: '0px',
              transform: `translate(${x + componentSize.width + 4}px, ${y}px)`,
            }}
          >
            {// render error
            status === 'ERROR' && (
              <Tooltip title={rawStatus.message || '配置项错误，点击修改'}>
                <Link to={`/projects/p/pipeline/${projectId}/conf/${id}`}>
                  <Icon type="warning" className={styles.errorTip} />
                </Link>
              </Tooltip>
            )}
            {// render running.
            status === 'RUNNING' && (
              <Tooltip title="作业运行中">
                <Icon type="loading" className={styles.taskRunningTip} />
              </Tooltip>
            )}
            {status === 'CALCULATED_ERROR' && (
              <Tooltip title="计算过程出错，点击查看">
                <Icon
                  type="warning"
                  className={styles.errorTip}
                  onClick={() => {
                    this.props.dispatch({
                      type: 'dataproPipeline/setInspectingComponent',
                      payload: {
                        component: this.props.model,
                        error: true,
                      },
                    });
                  }}
                />
              </Tooltip>
            )}
          </div>
        )}
        <DraggableCore
          onStop={e => this.handleDragStop(e)}
          onDrag={(e, draggableData) => this.handleDrag(e, draggableData)}
          onStart={e => this.handleDragStart(e)}
        >
          <div
            style={{
              width: `${componentSize.width}px`,
              height: `${componentSize.height}px`,
              background: `${getStylesForType(type, code)}`,
              transform: `translate(${x}px, ${y}px)`,
            }}
            onContextMenu={e => this.handleContextMenu(e)}
            className={`${extraStyle} ${nodeClassName}`}
            onDoubleClick={() => {
              if (this.props.onNodeClicked) {
                this.props.onNodeClicked(this.props.model, true);
              }
            }}
          >
            {type === 'Dataset' || type === 'Schema' ? (
              <Icon type="table" className={`${styles.antdIcon} x-icon`} />
            ) : (
              <i className={`${icon} x-icon`} />
            )}
            {name}
          </div>
        </DraggableCore>
      </React.Fragment>
    );
  }
}

export default NodeLayer;
