import React from 'react';
import { Button, Modal } from 'antd';
import TemplateList from './TemplateList';
import styles from './SelectTemplate.less';

export default class SelectTemplate extends React.PureComponent {
  constructor(props) {
    super(props);
    const initValue = props.value || {};
    this.state = {
      value: initValue.id,
      showDialog: false,
      selecting: undefined,
      valueName: initValue.name,
    };
  }

  componentDidMount() {
    // TODO fetch value.
  }

  componentWillReceiveProps(props) {
    const initValue = props.value || {};
    const { value } = this.state;
    if (value === undefined) {
      this.setState({
        value: initValue.id,
        showDialog: false,
        selecting: undefined,
        valueName: initValue.name,
      });
    }
  }

  renderSelectModal() {
    // render template select modal.
    return (
      <Modal
        title="选择模版"
        width={800}
        visible
        onOk={() => {
          this.setState({
            showDialog: false,
            value: this.state.selecting.id,
            valueName: this.state.selecting.name,
          });
          if (this.props.onChange) {
            this.props.onChange(this.state.selecting);
          }
        }}
        onCancel={() => this.setState({ showDialog: false, selecting: undefined })}
      >
        <TemplateList
          initValue={this.props.initValue}
          onChange={v => this.setState({ selecting: v })}
        />
      </Modal>
    );
  }

  render() {
    const { value, showDialog, valueName } = this.state;
    const { disabled, value: initialValue } = this.props;
    return (
      <React.Fragment>
        {!value && <span className={styles.tip}>未选择</span>}
        {value && <span className={styles.input}>{valueName}</span>}
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => this.setState({ showDialog: true })}
        >
          选择
        </Button>
        {showDialog && this.renderSelectModal()}
      </React.Fragment>
    );
  }
}
