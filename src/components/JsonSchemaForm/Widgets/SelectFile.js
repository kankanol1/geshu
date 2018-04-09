

import React from 'react';
import { Modal, Button, Col, Row, Input, Spin } from 'antd';

export default class SelectFile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      loading: true,
      listData: undefined,
      modal: false,
      path: {},
      select: {},
    };
    this.openSelectModel = this.openSelectModel.bind(this);
    this.select = this.select.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  componentWillMount() {
    // const { url } = this.props.uiSchema['ui:options'];
    // const url = '/api/component/sample';
    // fetch(url).then(results => results.json())
    //   .then(result => this.setState({ loading: false, listData: result }));
  }
  onChange(event) {
    this.setState({
      formData: {
        value: event.target.value,
      },
    }, () => this.props.onChange(this.state.formData));
  }
  openSelectModel() {
    this.setState({ modal: true });
    const url = '/api/component/sample';
    fetch(url).then(results => results.json())
      .then(result => this.setState({ loading: false, listData: result }));
  }
  select(indx) {
    this.setState({ select: indx });
  }
  handleOk() {
    this.setState({ modal: false });
    this.setState({ path: this.state.select });
  }

  render() {
    // if (this.state.loading) {
    //   return <div>Sample loading...</div>;
    // }
    const { value } = this.state;
    console.log('sample, props', this.props);
    return (
      <div><span>文件路径</span>
        {/* <select value={value} onChange={e => this.onChange(e)}>
          {this.state.listData.map(d => <option value={d} key={d}>{d}</option>)}
        </select> */}
        <Input value={this.state.path} />
        <Button type="primary" size="small" onClick={this.openSelectModel}>选择文件</Button>
        <Modal
          title="选择文件"
          visible={this.state.modal}
          onOk={this.handleOk}
          onCancel={() => { this.setState({ modal: false }); }}
        >
          {
            this.state.loading ? <Spin /> :
            this.state.listData.map(
              (list, index) => <p key={list} onClick={() => this.select(index)}>{list}</p>
            )
         }
        </Modal>
      </div>
    );
  }
}
