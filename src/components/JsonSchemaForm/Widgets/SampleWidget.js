

import React from 'react';
import { Modal, Button } from 'antd';

export default class SampleWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      loading: true,
      listData: undefined,
      modal: false,
    };
  }
  componentWillMount() {
    const { url } = this.props.uiSchema['ui:options'];
    // eslint-disable-next-line
    console.log('url', url);
    fetch(url).then(results => results.json())
      .then(result => this.setState({ loading: false, listData: result }));
  }
  onChange(event) {
    this.setState({
      formData: {
        value: event.target.value,
      },
    }, () => this.props.onChange(this.state.formData));
  }
  render() {
    if (this.state.loading) {
      return <div>Sample loading...</div>;
    }
    const { value } = this.state;
    return (
      <div>Sample
        <select value={value} onChange={e => this.onChange(e)}>
          {this.state.listData.map(d => <option value={d} key={d}>{d}</option>)}
        </select>
        <Button type="primary" size="small" onClick={() => { this.setState({ modal: true }); }}>Help</Button>
        <Modal
          title="Basic Modal"
          visible={this.state.modal}
          onOk={() => { this.setState({ modal: false }); }}
          onCancel={() => { this.setState({ modal: false }); }}
        >
        All available options:
          {this.state.listData.map(d => <p key={d}>{d}</p>)}
        </Modal>
      </div>
    );
  }
}
