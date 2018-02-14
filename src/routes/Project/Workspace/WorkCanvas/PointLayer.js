import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculatePointPositionDict } from '../../../../utils/PositionCalculation';


const R = { normal: 8, large: 12 };

class PointLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = { hovering: [] };
  }

  handleDragStop() {
    this.props.dispatch({
      type: 'work_canvas/endDrag',
    });
  }

  handleDragStart = (e) => {
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
    let originx = null;
    let originy = null;
    if (draggableData.node.x === undefined) {
      originx = draggableData.node.cx.baseVal.value;
      originy = draggableData.node.cy.baseVal.value;
    } else {
      originx = draggableData.node.x.baseVal.value;
      originy = draggableData.node.y.baseVal.value;
    }
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
      ...varObj
    });
  }

  render() {
    const { inputs, outputs } = this.props.model;
    const pointDict = this.props.pointDict === undefined ?
      calculatePointPositionDict(this.props.model)
      : this.props.positionDict[this.props.model.id];

    const renderPoint = (p, i, type) => {
      const point = {...p, metatype: type}
      const { x, y } = pointDict[point.id];
      const r = this.state.hovering.includes(point.id) ? R.large : R.normal;
      return (
        <React.Fragment key={i}>
          {
            // 1.  point background.
          }
          <circle
            cx={x}
            cy={y}
            r={r}
            stroke="#22075e"
            strokeWidth="1"
            fill="#b37feb"
          >
            <title>{point.hint}</title>
          </circle>
          {
            // 2. text.
          }
          <text
            x={x}
            y={y}
            alignmentBaseline="middle"
            textAnchor="middle"
            fill="white"
          >

            {point.label}
          </text>
          {
            // 3. opeartion circle.
          }

          <DraggableCore
            onDrag={(e, draggableData) => this.handleDrag(e, draggableData, point)}
            onStop={this.handleDragStop}
            onStart={this.handleDragStart}
          >
            <circle
              cx={x}
              cy={y}
              r={R.large}
              onMouseEnter={e => this.handleMouseEnter(e, point.id)}
              onMouseLeave={e => this.handleMouseLeave(e, point.id)}
              style={{ opacity: '0' }}
              stroke="#22075e"
              strokeWidth="1"
              fill="#b37feb"
              id={point.id}
              pointtype={point.type}
              pointconnects={point.connects}
            />
          </DraggableCore>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {
          inputs.map(
            (point, i) => {return renderPoint(point, i, 'input')}
          )
        }
        {
          outputs.map(
            (point, i) => {return renderPoint(point, i, 'output')}
          )
        }
      </React.Fragment>
    );
  }
}

export default PointLayer;
