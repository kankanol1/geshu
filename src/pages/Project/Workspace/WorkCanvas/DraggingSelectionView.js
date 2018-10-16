import React, { Component } from 'react';
import styles from './styles.less';

export default class DraggingSelectionView extends Component {
  render() {
    // dragging rect.
    let draggingRectView = null;
    const { dragging, startX, startY, stopX, stopY } = this.props.draggingSelection;
    if (dragging) {
      draggingRectView = (
        <div
          style={{
            transform: `translate(${startX < stopX ? startX : stopX}px, ${
              startY < stopY ? startY : stopY
            }px)`,
            width: `${Math.abs(stopX - startX)}px`,
            height: `${Math.abs(stopY - startY)}px`,
          }}
          className={styles.selectionDiv}
        />
      );
    }
    return draggingRectView;
  }
}
