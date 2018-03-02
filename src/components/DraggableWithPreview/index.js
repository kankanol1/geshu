import React from 'react';
import { DraggableCore } from 'react-draggable';

class DraggableWithPreview extends React.Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.state = {
      draggingView: undefined,
      dragging: {
        x: 0,
        y: 0,
      },
    };
  }

  handleDrag(e, draggableData) {
    e.preventDefault();
    this.setState({
      draggingView: true,
      dragging: {
        x: draggableData.x,
        y: draggableData.y,
      },
    });
    let preview = null;
    if (this.state.draggingView !== undefined) {
      preview = React.cloneElement(this.props.preview, { style: {
        ...this.props.preview.props.style,
        ...{
          position: 'absolute',
          left: `${this.state.dragging.x}px`,
          top: `${this.state.dragging.y}px`,
        },
      } });
    }
    this.props.onPreviewChanged(preview);
  }

  handleStop(e) {
    e.preventDefault();
    this.props.onItemDragged(this.state.dragging, {
      x: e.clientX,
      y: e.clientY,
    });
    this.setState({
      draggingView: undefined,
      dragging: {
        x: 0,
        y: 0,
      },
    });
    this.props.onPreviewChanged(null);
  }

  render() {
    const child = React.Children.only(this.props.children);
    return (
      <React.Fragment>
        <DraggableCore onDrag={this.handleDrag} onStop={this.handleStop}>
          {child}
        </DraggableCore>
      </React.Fragment>
    );
  }
}

export default DraggableWithPreview;
