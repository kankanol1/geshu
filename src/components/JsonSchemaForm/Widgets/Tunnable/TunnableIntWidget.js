import React from 'react';
import TunnableWidget from './TunnableWidget';

export default class TunnableIntWidget extends React.Component {
  render() {
    return (
      <TunnableWidget {...this.props} />
    );
  }
}
