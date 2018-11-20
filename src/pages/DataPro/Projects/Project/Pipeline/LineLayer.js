import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculateLineCurly } from '@/utils/PositionCalculation';
import SelectionChange from '@/obj/workspace/op/SelectionChange';

const r = 10 + 6;

class LineLayer extends React.Component {
  shouldComponentUpdate() {
    // need to know the connected components.
    return true;
    // if (!this.props.model) return true;
    // const result = !this.lastUpdated || this.lastUpdated < this.props.model.updated;
    // if (result) this.lastUpdated = this.props.model.updated;
    // return result;
  }

  render() {
    return (
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          pointerEvents: 'none',
        }}
        onClick={() => true}
      >
        {this.props.model.connections.map((line, i) => {
          const from = this.props.positionDict[line.component][line.from];
          const to = this.props.positionDict[this.props.model.id][line.to];
          const lineStr = calculateLineCurly(from.x + r, from.y, to.x - r, to.y);
          return (
            <React.Fragment key={i}>
              <path d={lineStr} style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }} />
            </React.Fragment>
          );
        })}
      </svg>
    );
  }
}

export default LineLayer;
