import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Menu, Icon, Card } from 'antd';
import ElementInspector from './ElementInspector';
import IndexInspector from './IndexInspector';


class GraphDesigner extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_schema_editor/initialize',
      payload: {
        palletContainer: 'myPalletteDiv',
        graphContainer: 'myDiagramDiv',
        id: this.props.match.params.id,
      },
    });
  }

  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Menu mode="horizontal">
          <Menu.Item>
            <a onClick={() => {
              this.props.dispatch({
                type: 'graph_schema_editor/saveSchema',
              });
            }}
            >
              <Icon type="save" />保存
            </a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => {
              this.props.dispatch({
                type: 'graph_schema_editor/clearSchema',
              });
            }}
            >
              <Icon type="delete" />清空
            </a>
          </Menu.Item>
          <Menu.Item>
            <a><Icon type="question-circle-o" />帮助</a>
          </Menu.Item>
          <Menu.Item>
            <a><Icon type="info-circle-o" />关于</a>
          </Menu.Item>
        </Menu>
        <Row>
          <Col span={6}>
            <Card title="元素" type="inner">
              <div
                id="myPalletteDiv"
                style={{
                height: '60px',
                 }}
              />
            </Card>
            <Card
              title="索引"
              type="inner"
              extra={
                <a onClick={() => {
                  this.props.dispatch({
                    type: 'graph_schema_editor/showIndexModal',
                    payload: {
                      id: -1,
                    },
                  });
                }}
                >
                  <Icon type="plus-circle" />
                  添加
                </a>
              }
            >
              <div style={{ margin: '-8px -10px', height: `${window.screen.availHeight - 455}px`, overflow: 'auto' }}>
                <IndexInspector />
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
                overflowY: 'auto',
              }
            }
            >
              <ElementInspector />
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default connect()(GraphDesigner);

