import React from 'react';
import DraggableWithPreview from '../../../../components/DraggableWithPreview';
import ComponentPreview from './ComponentPreview';
import { fillDefaultSize } from '../../../../utils/PositionCalculation';

class SiderSingleComponent extends React.PureComponent {
  render() {
    // data.
    const { kei, name, component } = this.props;
    // handler
    const { handlePreviewChange, onItemDragged } = this.props;
    const sizedComponent = fillDefaultSize(component);
    return (
      <DraggableWithPreview
        key={`${kei}-preview`}
        onItemDragged={(from, to) => onItemDragged(from, to, sizedComponent)}
        onPreviewChanged={handlePreviewChange}
        preview={<ComponentPreview component={sizedComponent} />}
      >
        <div
          key={`${kei}-display`}
          style={{
            wordBreak: 'break-all',
            cursor: 'default',
            textAlign: 'center',
            padding: '2px 5px',
            marginTop: '5px',
            marginBottom: '5px',
            border: '1px solid #bfbfbf',
            // ':hover': {
            //   background: '#1890FF',
            //   color: 'white',
            //   cursor: 'move',
            // },
          }}
        >
          {name}
        </div>
      </DraggableWithPreview>
    );
  }
}

export default SiderSingleComponent;
