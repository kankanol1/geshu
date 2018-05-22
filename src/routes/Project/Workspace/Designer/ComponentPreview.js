import React from 'react';
import NodeLayer from '../WorkCanvas/NodeLayer';
import PointLayer from '../WorkCanvas/PointLayer';

class ComponentPreview extends React.PureComponent {
  render() {
    return (
      <div style={this.props.style}>
        <NodeLayer model={this.props.component} />
        <PointLayer model={this.props.component} />
      </div>
    );
  }
}

export default ComponentPreview;
