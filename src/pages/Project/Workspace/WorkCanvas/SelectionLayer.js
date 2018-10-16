import React from 'react';
import styles from './styles.less';
import { componentSize } from './styles';

/**
 * this class renders selections and real-time changes. on the topest leve.
 */
class SelectionLayer extends React.Component {
  render() {
    let selectionView = null;
    // find selection.
    selectionView = this.props.selection.map((select, i) => {
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
                transform: `translate(${x + width - size}px, ${y - size}px)`,
              }}
            />
            <div
              className={styles.selectionDiv}
              style={{
                width: `${size * 2}px`,
                height: `${size * 2}px`,
                transform: `translate(${x - size}px, ${y + height - size}px)`,
              }}
            />
            <div
              className={styles.selectionDiv}
              style={{
                width: `${size * 2}px`,
                height: `${size * 2}px`,
                transform: `translate(${x + width - size}px, ${y + height - size}px)`,
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
                transform: `translate(${fromPoint.x}px, ${fromPoint.y - size}px)`,
              }}
            />
            <div
              className={styles.selectionDiv}
              style={{
                width: `${size * 2}px`,
                height: `${size * 2}px`,
                transform: `translate(${toPoint.x - 2 * size}px, ${toPoint.y - size}px)`,
              }}
            />
          </React.Fragment>
        );
      }
      return null;
    });

    return selectionView;
  }
}

export default SelectionLayer;
