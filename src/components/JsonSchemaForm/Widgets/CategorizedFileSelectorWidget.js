import React from 'react';
import { Modal, Button, Input, Spin, Icon, Row, Col, List } from 'antd';
import StorageFilePicker from '../../../routes/Storage/StorageFilePicker';

export default class CategorizedFileSelectorWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      modalVisible: false,
      selectionCache: undefined,
      error: undefined,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData,
    });
  }

  handleSelectionChange(v) {
    if (v !== undefined) {
      this.setState({ selectionCache: v, error: undefined });
    } else {
      this.setState({ selectionCache: v });
    }
  }

  handleOk() {
    const { selectionCache } = this.state;
    if (selectionCache === undefined) {
      this.setState({ error: '未选择文件' });
      return;
    }
    this.setState({
      formData: {
        value: selectionCache.fullPath,
      },
      modalVisible: false,
      error: undefined,
    }, () => this.props.onChange(this.state.formData));
  }

  render() {
    const { schema, required } = this.props;
    const lastSelected = this.state.formData.value;
    const { projectId } = this.props.uiSchema['ui:options'];
    return (
      <Row>
        <Col span={6}><legend>{schema.description} {required ? ' *' : null}</legend></Col>
        <Col span={6}> <Button type="primary" onClick={() => this.setState({ modalVisible: true })}>选择文件</Button> </Col>
        <Col span={12}>
          <Input value={(lastSelected === undefined) ? '未指定' : lastSelected} disabled />
        </Col>
        <Modal
          title="选择文件"
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => {
            this.setState({ error: undefined, modalVisible: false, selectionCache: undefined });
          }}
        >
          <span style={{ color: 'red' }}>{this.state.error}</span>
          <StorageFilePicker
            smallSize
            enableUpload
            enableMkdir
            onChange={v => this.handleSelectionChange(v)}
            view="index"
            mode="project"
            type="pipeline"
            project={{ id: projectId }}
          />
        </Modal>
      </Row>
    );
  }
}
