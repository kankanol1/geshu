import React from 'react';
import { DraggableCore } from 'react-draggable';
import { message } from 'antd';
import { calculatePointPositionDict } from '@/utils/PositionCalculation';
import styles from './styles.less';
import ConnectionAdd from '@/obj/workspace/op/ConnectionAdd';
import Connection from '@/obj/workspace/Connection';

const R = { normal: 6, large: 9 };

const overlapRange = 20;

class PointLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovering: [] };
    this.lastUpdated = -1;
    this.modelCache = undefined;
  }

  shouldComponentUpdate() {
    if (!this.props.model || this.modelCache !== this.props.model) return true;
    this.modelCache = this.props.model;
    const result = !this.lastUpdated || this.lastUpdated < this.props.model.updated;
    if (result) this.lastUpdated = this.props.model.updated;
    return result;
  }

  render() {
    const { inputs, outputs } = this.props.model;
    const pointDict =
      this.props.positionDict === undefined
        ? calculatePointPositionDict(this.props.model)
        : this.props.positionDict[this.props.model.id];

    const renderPoint = (p, i, type) => {
      const point = { ...p, metatype: type };
      const { x, y } = pointDict[point.id];
      const r = this.state.hovering.includes(point.id) ? R.large : R.normal;
      const offsetX = type === 'input' ? x - r * 2 : x;
      return (
        <React.Fragment key={i}>
          <div
            style={{
              width: `${r * 2}px`,
              height: `${r * 2}px`,
              transform: `translate(${offsetX}px, ${y - r}px)`,
              lineHeight: `${r * 2 - 6}px`,
              fontSize: `${r}px`,
              background: 'white',
            }}
            className={styles.pointDiv}
          />
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        {inputs.map((point, i) => {
          return renderPoint(point, i, 'input');
        })}
        {outputs.map((point, i) => {
          return renderPoint(point, i, 'output');
        })}
      </React.Fragment>
    );
  }
}

export default PointLayer;
