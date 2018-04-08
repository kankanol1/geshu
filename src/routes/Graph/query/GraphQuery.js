import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Icon, Button, Tabs, Alert, Modal, Spin, Select, Menu, Input } from 'antd';
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
    this.state = {
      activeTab: '2',
      show: false,
      currentQuery: '',
      showSave: false,
      queryName: '',
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
  componentWillReceiveProps(newProps) {
    if (newProps.loadedCode) { this.codeMirror.getCodeMirror().setValue(newProps.code); }
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
  handleSaveQueryModalOk = (e) => {
    this.setState({
      showSave: false,
    });
    this.props.dispatch({
      type: 'graph_query/saveQuery',
      payload: this.state.queryName,
    });
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
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <Modal
          title="保存查询"
          visible={this.state.showSave}
          onOk={this.handleSaveQueryModalOk}
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
          title="打开查询..."
          visible={this.state.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Spin spinning={this.props.queryLoading}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="选择查询..."
              optionFilterProp="children"
              value={this.state.currentQuery}
              onChange={this.handleChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                this.props.queries
                .map(value =>
                  <Select.Option value={value.index} key={value.index}>{value.name}</Select.Option>
                )
              }
            </Select>
          </Spin>
        </Modal>
        <Menu mode="horizontal">
          <strong style={{ marginLeft: '45%' }}>项目名称：{this.props.name}</strong>
        </Menu>
        <Row>
          <Col span={8} style={{ padding: '0', height: '100%' }}>
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
                <strong>&nbsp;&nbsp;Gremlin编辑器</strong>
                <div style={{
                    float: 'right',
                    marginBottom: '-6px',
                    marginRight: '-3px',

                  }}
                >
                  <Button.Group>
                    <Button
                      title="打开"
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
                      <Icon type="folder-open" />
                    </Button>
                    <Button
                      title="保存"
                      onClick={() => {
                      this.setState({ showSave: true, queryName: '' });
                    }}
                      size="small"
                    >
                      <Icon type="save" />
                    </Button>
                    <Button
                      title="运行"
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
                height: `${window.screen.availHeight - 205}px`,
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
                  <div style={{ marginTop: '-13px' }}>
                    <Alert message="关系图需要以[nodelist,edgelist]的格式返回" type="warning" />
                    <div
                      id="container"
                      style={{
                      height: `${window.screen.availHeight - 348}px`,
                      width: '100%',
                    }}
                    />
                  </div>
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
