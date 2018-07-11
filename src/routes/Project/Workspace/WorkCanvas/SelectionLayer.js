import React from 'react';
import { calculateLineStr, calculateLineCurly } from '../../../../utils/PositionCalculation';
import styles from './styles.less';
import { componentSize } from './styles';


/**
 * this class renders selections and real-time changes. on the topest leve.
 */
class SelectionLayer extends React.PureComponent {
  render() {
    const { dragging, draggingSource, draggingTarget } = this.props.lineDraggingState;

    let draggingView = null;

    if (dragging) {
      draggingView = (
        <svg style={{ height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' }}>
          <path
            d={calculateLineCurly(draggingSource.x, draggingSource.y,
            draggingTarget.x, draggingTarget.y)}
            style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }}
          />
        </svg>
      );
    }

    let selectionView = null;
    if (this.props.mode === 'select') {
      // find selection.
      selectionView = this.props.selection.map(
        (select, i) => {
          if (select.type === 'component') {
            const { x, y } = this.props.componentDict[select.id];
            const { width, height } = componentSize;
            // render selection.
            const size = 4;
            return (
              <React.Fragment key={i}>
                <div
                  className={styles.selectionDiv}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  transform: `translate(${x - size}px, ${y - size}px)`,
                }}
                />
                <div
                  className={styles.selectionDiv}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  transform: `translate(${(x + width) - size}px, ${y - size}px)`,
                }}
                />
                <div
                  className={styles.selectionDiv}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  transform: `translate(${x - size}px, ${(y + height) - size}px)`,
                }}
                />
                <div
                  className={styles.selectionDiv}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  transform: `translate(${(x + width) - size}px, ${(y + height) - size}px)`,
                }}
                />
              </React.Fragment>
            );
          } else if (select.type === 'line') {
            const size = 8;
            const halfSize = size / 2;
            const fromPoint = this.props.positionDict[select.source][select.from];
            const toPoint = this.props.positionDict[select.target][select.to];
            return (
              <React.Fragment key={i}>
                <div
                  className={styles.selectionDiv}
                  style={{
                  width: `${size * 2}px`,
                  height: `${size * 2}px`,
                transform: `translate(${(fromPoint.x)}px, ${fromPoint.y - size}px)`,
              }}
                />
                <div
                  className={styles.selectionDiv}
                  style={{
                  width: `${size * 2}px`,
                  height: `${size * 2}px`,
                transform: `translate(${toPoint.x - (2 * size)}px, ${toPoint.y - size}px)`,
              }}
                />
              </React.Fragment>
            );
          }
          return null;
        }
      );
    }

    // dragging rect.
    let draggingRectView = null;
    const { startX, startY, stopX, stopY } = this.props.runtime;
    if (this.props.runtime.dragging) {
      draggingRectView = (
        <div
          style={{
          transform: `translate(${startX < stopX ? startX : stopX}px, ${startY < stopY ? startY : stopY}px)`,
          width: `${Math.abs(stopX - startX)}px`,
          height: `${Math.abs(stopY - startY)}px`,
        }}
          className={styles.selectionDiv}
        />
      );
    }

    return (
      <React.Fragment>
        {selectionView}
        {draggingView}
        {draggingRectView}
      </React.Fragment>
    );
  }
}

export default SelectionLayer;
