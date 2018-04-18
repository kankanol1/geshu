import React from 'react';
import Radium from 'radium';
import DraggableWithPreview from '../../../components/DraggableWithPreview';
import ComponentPreview from './ComponentPreview';
import { fillDefaultSize } from '../../../utils/PositionCalculation';
import styles from './TopSingleComponent.less';
import { getIconNameForComponent } from './WorkCanvas/styles';
import './WorkCanvas/icon.less';

export default class TopSingleComponent extends React.PureComponent {
  render() {
    // data.
    const { kei, name, component } = this.props;
    // handler
    const { handlePreviewChange, onItemDragged } = this.props;
    const sizedComponent = fillDefaultSize(component);
    const icon = getIconNameForComponent(component.code);
    return (
      <DraggableWithPreview
        key={`${kei}-preview`}
        onItemDragged={
          (from, to) => onItemDragged(from, to, sizedComponent)
        }
        onPreviewChanged={handlePreviewChange}
        preview={<ComponentPreview component={sizedComponent} />}
      >
        <div
          key={`${kei}-display`}
          className={styles.component}
        >
          <i className={`x-icon-small ${icon}`} />
          {name}
        </div>
      </DraggableWithPreview>
    );
  }
}
