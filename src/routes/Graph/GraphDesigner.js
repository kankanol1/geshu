/* eslint-disable */
import React, { Component } from 'react';
import { Layout, Collapse, Row, Col, Tabs, Modal, Input, Button } from 'antd';
import graphUtil from './GraphUtils';
import ElementInspector from './ElementInspector';

const { TextArea } = Input;
let myDiagram;

export default class GraphDesigner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalType: '',
      json: '',
    };
  }

  componentDidMount() {
    myDiagram = graphUtil.init('myPaletteDiv', 'myDiagramDiv');
  }

  load() {
    this.setState({
      showModal: true,
      json: '',
      modalType: 'import',
    });
  }

  save() {
    this.setState({
      showModal: true,
      json: graphUtil.toJson(myDiagram),
      modalType: 'export',
    });
  }


  handleOk = (e) => {
    this.setState({
      showModal: false,
    });
    if (this.state.modalType === 'import') {
      graphUtil.fromJson(myDiagram, this.state.json);
    }
  }

  handleCancel = (e) => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Modal
          title="导入/导出"
          visible={this.state.showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <TextArea
            value={this.state.json}
            autosize={{ minRows: 2 }}
            onChange={(e) => {
              this.setState({
                json: e.target.value,
              });
            }}
          />
        </Modal>
        <Row>
          <Col span={4}>
            <Collapse defaultActiveKey={['1']}>
              <Collapse.Panel header="元素" key="1">
                <div id="myPaletteDiv" style={{ height: '200px' }} />
              </Collapse.Panel>
              <Collapse.Panel header="导入/导出" key="2">
                <Button
                  type="primary"
                  icon="folder-open"
                  style={{ margin: '5px' }}
                  onClick={this.load.bind(this)}
                >
                  导入JSON
                </Button>
                <Button
                  type="primary"
                  icon="download"
                  style={{ margin: '5px' }}
                  onClick={this.save.bind(this)}
                >
                  导出JSON
                </Button>
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col span={14} style={{ padding: '0', height: '100%' }}>
            <div
              style={{
                background: '#fff',
                padding: 0,
                margin: '0px 5px',
                height: `${window.screen.availHeight - 250}px`,
                width: '100%',
              }}
              id="myDiagramDiv"
            />
          </Col>
          <Col span={6}>
            <div style={{
              background: '#fff',
              padding: '3px',
              margin: '0px 10px',
              height: `${window.screen.availHeight - 250}px`,
              width: '100%',
            }}
            >
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="元素配置" key="1">
                  <ElementInspector diagram={myDiagram} />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}
