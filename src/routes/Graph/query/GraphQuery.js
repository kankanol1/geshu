import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Icon, Button, Tabs, Alert, Modal, Spin, Select, Menu, Input } from 'antd';
import CodeMirror from 'react-codemirror';
import SplitterLayout from 'react-splitter-layout';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import styles from './GraphQuery.css';
import './gremlin';
import QueryTable from './QueryTable';


class GraphQuery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '2',
      show: false,
      currentQuery: '',
      showSave: false,
      queryName: '',
      editorName: '',
      create: false,
      // queryId: '',
      // querySaveName: '',
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_query/initialize',
      payload: {
        container: 'container',
        id: this.props.match.params.id,
        dblClick: (currentObject) => {
          this.props.dispatch({
            type: 'graph_query/exploreGraph',
            payload: currentObject,
          });
        },
      },
    });
  }
  handleOk = (e) => {
    this.props.dispatch({
      type: 'graph_query/loadQuery',
      payload: this.state.currentQuery,
    });
    this.setState({
      show: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      show: false,
    });
  }
  handleSaveAsQueryModalOk = (e) => {
    this.setState({
      showSave: false,
      editorName: this.state.queryName,
      create: true,
    });
    this.props.dispatch({
      type: 'graph_query/saveAsQuery',
      payload: this.state.queryName,
    });
  }
  handleSaveQueryOk = (e) => {
    if (!this.state.create) {
      this.setState({ showSave: true, queryName: '' });
    } else {
      this.props.dispatch({
        type: 'graph_query/saveQuery',
        payload: { query: this.props.code, id: this.props.queryId, name: this.props.name },
      });
    }
  }
  handleSaveQueryModalCancel = (e) => {
    this.setState({
      showSave: false,
    });
  }
  handleChange=(value) => {
    this.setState({
      currentQuery: value,
    });
  }

  render() {
    const editorName = this.state.editorName === '' ? 'Gremlin编辑器' : `正在编辑：${this.state.editorName}`;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Modal
          title="保存查询"
          visible={this.state.showSave}
          onOk={this.handleSaveAsQueryModalOk}
          onCancel={this.handleSaveQueryModalCancel}
        >
          <Row>
            <Col span={6}><strong>查询名称：</strong></Col>
            <Col span={18}>
              <Input
                value={this.state.queryName}
                onChange={(e) => { this.setState({ queryName: e.target.value }); }}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="查询列表"
          visible={this.state.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
        >
          <QueryTable onOpen={(query, id, name) => {
            this.setState({
              show: false,
              editorName: name,
              create: true,
            });
            this.codeMirror.getCodeMirror().setValue(query);
            this.props.dispatch({
              type: 'graph_query/saveCode',
              payload: { query, queryId: id, querySaveName: name },
            });
          }}
          />
        </Modal>
        <div
          style={{
             background: 'white',
             height: '50px',
             padding: '10px',
             width: '100%',
             margin: '2px 0',
          }}
        >
          <strong style={{ marginLeft: '50%' }}>项目名称：{this.props.name}</strong>
        </div>
        <div style={{ width: '100%', height: '100%', background: 'white', position: 'relative' }}>
          <SplitterLayout
            primaryIndex={0}
            onDragEnd={() => {
            this.props.dispatch({
              type: 'graph_query/scaleGraph',
            });
          }}
          >
            <div
              style={{
                background: '#fff',
                height: `${window.screen.availHeight - 250}px`,
                width: '100%',
                borderRadius: '3px',
                border: '1px solid #e6e7ea',
              }}
            >
              <div style={{
                  width: '100%',
                  padding: '7px',
                  backgroundColor: '#f7f7f8',
                  borderBottom: '1px solid #e6e7ea',
                }}
              >
                <strong>&nbsp;&nbsp;{editorName}</strong>
                <div style={{
                    float: 'right',
                    marginBottom: '-6px',
                    marginRight: '-3px',

                  }}
                >
                  <Button.Group>
                    <Button
                      title="查询管理"
                      disabled={!this.props.inited}
                      onClick={() => {
                        this.setState({
                          show: true,
                         });
                          this.props.dispatch({
                          type: 'graph_query/startLoadQueries',
                        });
                         this.props.dispatch({
                          type: 'graph_query/queryList',
                        });
                    }}
                      size="small"
                    >
                      <Icon type="profile" />
                    </Button>
                    <Button
                      title="保存"
                      onClick={this.handleSaveQueryOk}
                      size="small"
                      disabled={!this.props.inited}
                    >
                      <Icon type="save" />
                    </Button>
                    <Button
                      title="另存为"
                      disabled={!this.props.inited}
                      onClick={() => {
                      this.setState({ showSave: true, queryName: '' });
                    }}
                      size="small"
                    >
                      <Icon type="form" />
                    </Button>
                    <Button
                      title="运行"
                      disabled={!this.props.inited}
                      onClick={() => {
                       this.props.dispatch({
                        type: 'graph_query/queryGraph',
                      });
                    }}
                      type="primary"
                      size="small"
                    >
                      <Icon type="caret-right" />
                    </Button>
                  </Button.Group>
                </div>
              </div>

              <div
                style={{
                height: `${window.screen.availHeight - 242}px`,
              }}
              >
                <CodeMirror
                  ref={(e) => { this.codeMirror = e; }}
                  value={this.props.code}
                  onChange={(value) => {
                    this.props.dispatch({
                      type: 'graph_query/saveCode',
                      payload: { query: value, queryId: this.props.queryId, querySaveName: this.props.querySaveName },// eslint-disable-line
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
            <div
              style={{
                background: '#fff',
                padding: '3px 10px',
                margin: '0px 5px',
              }}
            >
              <Tabs
                activeKey={this.state.activeTab}
                onChange={(value) => { this.setState({ activeTab: value }); }}
              >
                <Tabs.TabPane tab="关系图" disabled={!this.props.showGraph} key="2">
                  <div style={{ marginTop: '-13px' }}>
                    <Alert message="关系图需要以[nodelist,edgelist]的格式返回" type="warning" />
                    <div
                      id="container"
                      style={{
                        height: `${window.screen.availHeight - 304}px`,
                        width: '100%',
                    }}
                    />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="JSON" key="1">
                  <div>
                    <Highlight className="json">
                      {this.props.responseJson}
                    </Highlight>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </SplitterLayout>
        </div>
      </Layout>
    );
  }
}
export default connect(({ graph_query }) => {
  return {
    ...graph_query,
  };
})(GraphQuery);
