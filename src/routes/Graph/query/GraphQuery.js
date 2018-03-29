import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Icon, Button, Tabs, Menu } from 'antd';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import styles from './GraphQuery.css';
import './gremlin';


class GraphQuery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { activeTab: '2' };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_query/initialize',
      payload: {
        container: 'container',
        id: this.props.match.params.id,
      },
    });
  }
  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Row>
          <Col span={8} style={{ padding: '0', height: '100%' }}>
            <div
              style={{
                background: '#fff',
                height: `${window.screen.availHeight - 250}px`,
                width: '100%',
                border: '1px solid #d9d9d9',
                borderRadius: '3px',

              }}
            >
              <div style={{ background: '#f9f8f8', width: '100%', height: '32px', borderBottom: '1px solid #d9d9d9' }}>
                <div style={{ float: 'right' }}>
                  <Button.Group>
                    <Button >
                      <Icon type="save" />
                      保存
                    </Button>
                    <Button onClick={() => {
                       this.props.dispatch({
                        type: 'graph_query/queryGraph',
                      });
                    }}
                    >
                      <Icon type="caret-right" />
                      运行
                    </Button>
                  </Button.Group>
                </div>
              </div>
              <div
                style={{
                height: `${window.screen.availHeight - 284}px`,
              }}
              >
                <CodeMirror
                  value={this.props.code}
                  onChange={(value) => {
                    this.props.dispatch({
                      type: 'graph_query/saveCode',
                      payload: value,
                    });
                  }}
                  className={styles.codeEditor}
                  options={{
                    lineNumbers: true,
                    mode: 'gremlin',
                    theme: 'solarized',
                }}
                />
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div
              style={
              {
                background: '#fff',
                padding: '3px 10px',
                margin: '0px 5px',
                height: `${window.screen.availHeight - 254}px`,
                width: '100%',
              }
            }
            >
              <Tabs
                activeKey={this.state.activeTab}
                onChange={(value) => { this.setState({ activeTab: value }); }}
              >
                <Tabs.TabPane tab="JSON" key="1">
                  <div style={{ height: `${window.screen.availHeight - 324}px`, overflowY: 'auto' }}>
                    <Highlight className="json">
                      {this.props.responseJson}
                    </Highlight>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="关系图" disabled={!this.props.showGraph} key="2">
                  <div
                    id="container"
                    style={{
                      height: `${window.screen.availHeight - 324}px`,
                      width: '100%',
                    }}
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}
export default connect(({ graph_query }) => {
  return {
    ...graph_query,
  };
})(GraphQuery);
