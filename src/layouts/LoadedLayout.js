import React from 'react';
import GlobalLoading from './GlobalLoading';

export default class LoadedLayout extends React.Component {
  state = {
    layoutLoading: true,
  }

  render() {
    if (this.state.layoutLoading !== false) {
      return <GlobalLoading onLoaded={() => this.setState({ layoutLoading: false })} />;
    } else {
      return this.renderLayout();
    }
  }
}
