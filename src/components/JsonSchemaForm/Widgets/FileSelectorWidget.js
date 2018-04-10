import React from 'react';
import { Modal, Button, Input, Spin, Icon, Row, Col, List } from 'antd';
import styles from './FileSelectorWidget.less';


const extractFileName = (path) => {
  const nameArr = path.split('/');
  return nameArr[nameArr.length - 1];
};

export default class FileSelectorWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      loading: true,
      listData: undefined,
      modalVisible: false,
      path: '/',
      selected: undefined,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData,
    });
  }

  requestList(path) {
    // set loading.
    this.setState({ loading: true, path });
    const url = this.props.uiSchema['ui:options'];
    const urlWithParam = `${url}?path=${path}`;
    fetch(urlWithParam).then(results => results.json())
      .then((result) => {
        const translatedResult = [];
        result.forEach((r, i) => {
          if (i === 0) {
            if (path !== '/') {
              translatedResult.push({ ...r, name: '..' });
            }
          } else {
            translatedResult.push({ ...r, name: extractFileName(r.path) });
          }
        });
        this.setState({ loading: false, listData: translatedResult });
      });
  }

  openSelectModal() {
    this.setState({ modalVisible: true });
    this.requestList(this.state.path);
  }

  handleItemClick(e, item) {
    if (item.name === '..') {
      // upper folder.
      this.requestList(item.path.substr(0, item.path.length - extractFileName(item.path).length));
    } else if (item.isdir) {
      this.requestList(item.path);
    } else {
      this.setState({ selected: item.path });
    }
  }

  handleOk() {
    // update on change.
    this.setState({
      formData: {
        value: this.state.selected,
      },
      modalVisible: false,
    }, () => this.props.onChange(this.state.formData));
  }

  render() {
    const { schema, required } = this.props;
    const { selected, listData } = this.state;
    const lastSelected = this.state.formData.value;
    return (
      <Row>
        <Col span={6}><legend>{schema.description} {required ? ' *' : null}</legend></Col>
        <Col span={6}> <Button type="primary" onClick={() => this.openSelectModal()}>选择文件</Button> </Col>
        <Col span={12}>
          <Input value={(lastSelected === undefined) ? '未指定' : lastSelected} disabled />
        </Col>
        <Modal
          title="选择文件"
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => { this.setState({ modalVisible: false }); }}
          className={styles.fileSelector}
        >
          {
            this.state.loading ? <div className={styles.loadingContainer}><Spin /></div> :
            (
              <List
                size="small"
                bordered
                dataSource={listData}
                renderItem={item => (
                  <List.Item
                    onClick={(e) => { this.handleItemClick(e, item); }}
                    className={item.path === selected ? styles.selectedItem : null}
                  >
                    <a><Icon type={item.isdir ? 'folder' : 'file'} /> {item.name}</a>
                  </List.Item>
                )}
              />
            )
         }
        </Modal>
      </Row>
    );
  }
}
