import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculatePointPositionDict } from '../../../../utils/PositionCalculation';
import styles from './styles.less';

const R = { normal: 8, large: 9 };

class PointLayer extends React.Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = { hovering: [] };
  }

  shouldComponentUpdate() {
    // only update when selected.
    const { selection, model } = this.props;
    return selection ? selection.filter(s => s.id === model.id).length > 0 : true;
  }

  handleDragStop(e) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/endDrag',
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
      type: 'work_canvas/draggingLine',
      componentId: this.props.model.id,
      pointId: point.id,
      draggingSource: {
        x: originx,
        y: originy,
      },
      draggingTarget: {
        x: (this.props.draggingTarget.x == null ? originx :
          this.props.draggingTarget.x) + draggableData.deltaX,
        y: (this.props.draggingTarget.y == null ? originy :
          this.props.draggingTarget.y) + draggableData.deltaY,
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
            onStop={this.handleDragStop}
            onStart={this.handleDragStart}
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
