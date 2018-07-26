import React, { Component } from 'react';
import { calculateLineCurly } from '../../../../utils/PositionCalculation';

export default class DraggingLineView extends Component {
  render() {
    const { dragging, draggingSource,
      draggingTarget, draggingMetaType } = this.props.lineDraggingState;

    let draggingView = null;

    if (dragging) {
      draggingView = (
        <svg style={{ height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' }}>
          <path
            d={draggingMetaType === 'input' ?
              calculateLineCurly(draggingTarget.x, draggingTarget.y,
                draggingSource.x, draggingSource.y)
              : calculateLineCurly(draggingSource.x, draggingSource.y,
              draggingTarget.x, draggingTarget.y)}
            style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }}
          />
        </svg>
      );
    }
    return draggingView;
  }
}
