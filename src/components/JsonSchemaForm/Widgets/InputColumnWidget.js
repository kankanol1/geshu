

import React from 'react';
import { Modal, Button } from 'antd';

export default class InputColumnWidget extends React.PureComponent {
  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    if (getField !== undefined) {
      try {
        getField();
      } catch (err) {
        // console.log('err', err);
      }
    } else {
      // console.log('undefined');
    }
    return 'hi';
  }
}
