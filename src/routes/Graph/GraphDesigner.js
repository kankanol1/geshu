import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Tabs, Modal, Input, Menu, Icon, Card } from 'antd';
import ElementInspector from './ElementInspector';
import IndexInspector from './IndexInspector';

import graphUtils from '../../utils/graph_utils';

const { TextArea } = Input;
class GraphDesigner extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalType: '',
      json: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'graph_schema_editor/create',
      palletContainer: 'myPalletteDiv',
      graphContainer: 'myDiagramDiv',
    });
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
      json: graphUtils.toJson(this.props.diagram),
      modalType: 'export',
    });
  }

  handleOk = () => {
    this.setState({
      showModal: false,
    });
    if (this.state.modalType === 'import') {
      graphUtils.fromJson(this.props.diagram, this.state.json);
    }
  }

  handleCancel = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Menu mode="horizontal">
          <Menu.Item >
            <a onClick={this.load.bind(this)}><Icon type="folder-open" />导入JSON</a>
          </Menu.Item>
          <Menu.Item >
            <a onClick={this.save.bind(this)}><Icon type="download" /> 导出JSON</a>
          </Menu.Item>
          <Menu.Item >
            <a onClick={this.save.bind(this)} ><Icon type="save" />保存当前图</a>
          </Menu.Item>
          <Menu.Item >
            <a onClick={this.save.bind(this)}><Icon type="delete" />清空当前图</a>
          </Menu.Item>
        </Menu>
        <Modal
          title={this.state.type === 'import' ? '导入JSON' : '导出JSON'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          visible={this.state.showModal}
        >
          <TextArea
            autosize={{ minRows: 2 }}
            value={this.state.json}
            onChange={(e) => { this.setState({ json: e.target.value }); }}
          />
        </Modal>
        <Row>
          <Col span={6}>
            <Card title="元素" type="inner">
              <div id="myPalletteDiv" style={{ height: '60px' }} />
            </Card>
            <Card
              title="索引"
              type="inner"
              extra={<a onClick={() => { this.indexInspector.add(); }}><Icon type="plus-circle" /> 添加</a>}
            >
              <div style={{ margin: '-8px -10px', height: `${window.screen.availHeight - 455}px`, overflow: 'auto' }} >
                <IndexInspector ref={(e) => { this.indexInspector = e; }} />
              </div>
            </Card>
          </Col>
          <Col span={10} style={{ padding: '0', height: '100%' }}>
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
          <Col span={8}>
            <div style={
              {
                background: '#fff',
                padding: '3px',
                margin: '0px 10px',
                height: `${window.screen.availHeight - 250}px`,
                width: '100%',
              }
            }
            >
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="元素配置" key="1"><ElementInspector /></Tabs.TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}
export default connect((state) => { return { diagram: state.graph_schema_editor.diagram }; })(GraphDesigner);

