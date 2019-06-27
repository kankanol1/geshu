import React from 'react';
import { Modal, Input } from 'antd';

class OPRenameModal extends React.PureComponent {
  state = {
    value: undefined,
  };

  render() {
    const { onOk, onCancel } = this.props;
    const { value } = this.state;
    return (
      <Modal title="重命名" visible onOk={() => onOk(value)} onCancel={() => onCancel()}>
        <Input value={value} onChange={e => this.setState({ value: e.target.value })} />
      </Modal>
    );
  }
}

export default OPRenameModal;
