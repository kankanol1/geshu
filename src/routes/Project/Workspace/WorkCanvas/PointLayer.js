import React from 'react';
import { DraggableCore } from 'react-draggable';
import { message } from 'antd';
import { calculatePointPositionDict } from '../../../../utils/PositionCalculation';
import styles from './styles.less';
import ConnectionAdd from '../../../../obj/workspace/op/ConnectionAdd';
import Connection from '../../../../obj/workspace/Connection';

const R = { normal: 8, large: 9 };

const overlapRange = 20;

class PointLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovering: [] };
    this.lastUpdated = -1;
  }

  shouldComponentUpdate() {
    if (!this.props.model) return true;
    const result = !this.lastUpdated || this.lastUpdated < this.props.model.updated;
    if (result) this.lastUpdated = this.props.model.updated;
    return result;
  }

  handleDragStop(e) {
    e.preventDefault();
    // calculate overlapped points.
    const { model, canvas, lineDraggingState } = this.props;
    const { draggingComponent, draggingPoint, draggingSource,
      draggingTarget, draggingType,
      draggingConnects, draggingMetaType } = lineDraggingState;

    const overlapped = [];
    Object.entries(canvas.componentSocketPositionCache).forEach(([id, positionDict]) => {
      Object.entries(positionDict).forEach(([pid, { x, y }]) => {
        if (Math.abs(x - draggingTarget.x) <= overlapRange &&
            Math.abs(y - draggingTarget.y) <= overlapRange) {
          overlapped.push(`${id}-${pid}`);
        }
      });
    });

    // get the overlapped types
    const overlappedInputs = [];
    const overlappedOutputs = [];
    canvas.components.forEach((c) => {
      c.inputs.forEach((i) => {
        if (overlapped.includes(`${c.id}-${i.id}`)) {
          overlappedInputs.push({
            component: c,
            pointId: i.id,
            type: i.type,
            connects: i.connects,
            metatype: i.metatype,
          });
        }
      });
      c.outputs.forEach((i) => {
        if (overlapped.includes(`${c.id}-${i.id}`)) {
          overlappedOutputs.push({
            component: c,
            pointId: i.id,
            type: i.type,
            connects: i.connects,
            metatype: i.metatype,
          });
        }
      });
    });

    if (overlappedOutputs.length !== 0) {
      if (draggingMetaType === 'input') {
        const candidate = overlappedOutputs[0];
        if (candidate.component.id === draggingComponent) {
          message.info('暂不能将同一组件首位相连');
        } else if (draggingConnects.includes(candidate.type)) {
          // candidate is output, meaning dragging source should be an output.
          // add connectFrom to the candidate point.
          // add new line.
          const newOp = new ConnectionAdd(model, new Connection(
            candidate.component.id,
            candidate.pointId,
            draggingPoint,
          ));
          canvas.apply(newOp);
        } else {
          message.info('not compatiable');
        }
      } else {
        message.info('needs to be connected with an output point');
      }
    }
    if (overlappedInputs.length !== 0) {
      if (draggingMetaType === 'output') {
        const candidate = overlappedInputs[0];
        // candidate is output, meansing dragging source should be an input.
        // the other way round.
        if (candidate.component.id === draggingComponent) {
          message.info('暂不能将同一组件首位相连');
        } else if (candidate.connects.includes(draggingType)) {
          const newOp = new ConnectionAdd(candidate.component, new Connection(
            draggingComponent, draggingPoint, candidate.pointId,
          ));
          canvas.apply(newOp);
        } else {
          message.info('not compatiable');
        }
      } else {
        message.info('needs to be connected with an input point');
      }
    }
    this.props.dispatch({
      type: 'workcanvas/canvasDraggingLineReset',
    });
  }

  handleDragStart = (e) => {
    e.preventDefault();
    // stop propagation to parent.
    e.stopPropagation();
  }

  handleMouseEnter(e, id) {
    this.setState({ hovering: [id] });
  }
  handleMouseLeave() {
    this.setState({ hovering: [] });
  }

  handleDrag(e, draggableData, point) {
    e.preventDefault();
    const originx = draggableData.x;
    const originy = draggableData.y;
    let varObj = null;
    if (point.metatype === 'input') {
      varObj = { draggingType: null, draggingConnects: point.connects };
    } else if (point.metatype === 'output') {
      varObj = { draggingType: point.type, draggingConnects: [] };
    }
    this.props.dispatch({
      type: 'workcanvas/canvasDraggingLineUpdate',
      componentId: this.props.model.id,
      pointId: point.id,
      draggingSource: {
        x: originx,
        y: originy,
      },
      draggingTarget: {
        x: (this.props.lineDraggingState.draggingTarget.x == null ? originx :
          this.props.lineDraggingState.draggingTarget.x) + draggableData.deltaX,
        y: (this.props.lineDraggingState.draggingTarget.y == null ? originy :
          this.props.lineDraggingState.draggingTarget.y) + draggableData.deltaY,
      },
      draggingMetaType: point.metatype,
      ...varObj,
    });
  }

  render() {
    const { inputs, outputs } = this.props.model;
    const pointDict = this.props.positionDict === undefined ?
      calculatePointPositionDict(this.props.model)
      : this.props.positionDict[this.props.model.id];

    const renderPoint = (p, i, type) => {
      const point = { ...p, metatype: type };
      const { x, y } = pointDict[point.id];
      const r = this.state.hovering.includes(point.id) ? R.large : R.normal;
      const offsetX = (type === 'input') ? x - (r * 2) : x;
      return (
        <React.Fragment key={i}>
          <DraggableCore
            onDrag={(e, draggableData) => this.handleDrag(e, draggableData, point)}
            onStop={e => this.handleDragStop(e)}
            onStart={e => this.handleDragStart(e)}
          >
            <div
              style={{
            width: `${r * 2}px`,
            height: `${r * 2}px`,
            transform: `translate(${offsetX}px, ${y - r}px)`,
            lineHeight: `${(r * 2) - 6}px`,
            fontSize: `${r}px`,
            background: 'white',
          }}
              className={styles.pointDiv}
              onMouseEnter={e => this.handleMouseEnter(e, point.id)}
              onMouseLeave={e => this.handleMouseLeave(e, point.id)}
            >
              {point.label && (point.label.length > 0) ? point.label.charAt(0).toUpperCase() : ''}
            </div>
          </DraggableCore>
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        {
          inputs.map(
            (point, i) => { return renderPoint(point, i, 'input'); }
          )
        }
        {
          outputs.map(
            (point, i) => { return renderPoint(point, i, 'output'); }
          )
        }
      </React.Fragment>
    );
  }
}

export default PointLayer;
