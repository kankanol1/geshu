import React from 'react';
import { Modal, Button, Input, Spin, Icon, Row, Col, List } from 'antd';
import styles from './DatabaseSelectorWidget.less';


const listData = [
  { name: 'hi' },
];

export default class FileSelectorWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { modalVisible: true };
  }

  render() {
    const { schema, required } = this.props;
    const lastSelected = undefined;
    const selected = undefined;
    return (
      <Row>
        <Col span={6}><legend>{schema.description} {required ? ' *' : null}</legend></Col>
        <Col span={6}> <Button type="primary" onClick={() => this.openSelectModal()}>选择</Button> </Col>
        <Col span={12}>
          <Input value={(lastSelected === undefined) ? '未指定' : lastSelected} disabled />
        </Col>
        <Modal
          title="选择数据库"
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
