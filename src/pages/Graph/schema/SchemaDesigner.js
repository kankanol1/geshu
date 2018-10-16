import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Menu, Icon, Card, Modal, Spin } from 'antd';
import ElementInspector from './ElementInspector';
import IndexInspector from './IndexInspector';
import styles from '../Inspectors.less';

const { confirm } = Modal;

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
    const { loading } = this.props;
    return (
      <Spin spinning={loading} tip="加载中...">
        <Layout theme="light">
          <Menu mode="horizontal">
            <Menu.Item
              style={{
                display: `${
                  this.props.status === 'SCHEMA_EXECUTED' || this.props.status === 'DATA_UPLOADED'
                    ? 'none'
                    : 'inline-block'
                }`,
              }}
            >
              <a
                onClick={() => {
                  this.props.dispatch({
                    type: 'graph_schema_editor/saveSchema',
                  });
                }}
              >
                <Icon type="save" />
                保存
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                onClick={() => {
                  this.props.dispatch({
                    type: 'graph_schema_editor/clearSchema',
                  });
                }}
              >
                <Icon type="delete" />
                清空
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                onClick={() => {
                  const self = this;
                  confirm({
                    title: '确定开始创建数据库？',
                    content: '系统将会保存当前已进行的设计，并进行创建操作。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                      self.props.status = 'SCHEMA_EXECUTED';
                      self.props.dispatch({
                        type: 'graph_schema_editor/saveSchema',
                        payload: 'execute',
                      });
                    },
                    onCancel() {},
                  });
                }}
              >
                <Icon type="caret-right" />
                运行
              </a>
            </Menu.Item>
            <Menu.Item>
              <a>
                <Icon type="info-circle-o" />
                关于
              </a>
            </Menu.Item>
          </Menu>
          <div className={styles.projectTitle}>
            <strong>
              项目名称：
              {this.props.name}
            </strong>
          </div>
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
                  <a
                    onClick={() => {
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
                <div
                  style={{
                    margin: '-8px -10px',
                    height: `${window.screen.availHeight - 410}px`,
                    overflow: 'auto',
                  }}
                >
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
                  height: `${window.screen.availHeight - 205}px`,
                  width: '100%',
                }}
                id="myDiagramDiv"
              />
            </Col>
            <Col span={8}>
              <div
                style={{
                  background: '#fff',
                  padding: '10px 3px',
                  margin: '0px 10px',
                  height: `${window.screen.availHeight - 205}px`,
                  width: '100%',
                  overflowY: 'auto',
                }}
              >
                <ElementInspector />
              </div>
            </Col>
          </Row>
        </Layout>
      </Spin>
    );
  }
}

export default connect(({ graph_schema_editor, loading }) => {
  return {
    ...graph_schema_editor,
    loading: loading.models.graph_schema_editor,
  };
})(GraphDesigner);
