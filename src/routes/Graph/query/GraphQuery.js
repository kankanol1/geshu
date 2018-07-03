import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Icon, Button, Tabs, Alert, Modal, Spin, Select, Menu, Input, Table, Popconfirm } from 'antd';
import CodeMirror from 'react-codemirror';
import SplitterLayout from 'react-splitter-layout';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import styles from './GraphQuery.css';
import './gremlin';
import QueryTable from './QueryTable';
import PullUpFrame from '../../../components/PullUpFrame';
import QueryVariable from './QueryVariable';
import QueryVariableForm from './QueryVariableForm';

const { Header } = Layout;

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
      variableList: [],
      create: false,
      pullBoxRange: true,
      variableRange: true,
      code: '',
      variableConfirm: false,
      variableRepeat: [],
      variableListAll: [],
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
  columns = [
    {
      title: '变量',
      dataIndex: 'variableName',
      align: 'center',
    },
    {
      title: '值',
      dataIndex: 'variableDesc',
      align: 'center',
    },
    {
      title: '删除',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <span>
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleVariableDelete(record)}>
              <Icon type="minus-circle" className={styles.variableIcon} />
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];
  handleOk = () => {
    this.props.dispatch({
      type: 'graph_query/loadQuery',
      payload: this.state.currentQuery,
    });
    this.setState({
      show: false,
    });
  }
  handleCancel = () => {
    this.setState({
      show: false,
    });
  }
  handleSaveAsQueryModalOk = () => {
    const variableListAll = [];
    this.state.variableList.map((item, index) => {
      if (item.variableName !== '' && item.variableDesc !== '') {
        variableListAll.push(item);
      }
      return variableListAll;
    });
    this.setState({
      showSave: false,
      editorName: this.state.queryName,
      create: true,
    });
    this.props.dispatch({
      type: 'graph_query/saveAsQuery',
      payload: { name: this.state.queryName, variableList: variableListAll },
    });
  }
  handleSaveQueryOk = () => {
    const variableListAll = [];
    this.state.variableList.map((item, index) => {
      if (item.variableName !== '' && item.variableDesc !== '') {
        variableListAll.push(item);
      }
      return variableListAll;
    });
    if (!this.state.create) {
      this.setState({ showSave: true, queryName: '' });
    } else {
      this.props.dispatch({
        type: 'graph_query/saveQuery',
        payload: {
          query: this.props.code,
          id: this.props.queryId,
          name: this.props.name,
          variableList: variableListAll,
        },
      });
    }
  }
  handleSaveQueryModalCancel = () => {
    this.setState({
      showSave: false,
    });
  }
  handleChange = (value) => {
    this.setState({
      currentQuery: value,
    });
  }
  tagClick = (pullBoxRange) => {
    this.setState({
      pullBoxRange,
    });
  }
  variableChange = () => {
    this.setState({
      variableRange: !this.state.variableRange,
    });
  }
  removeAttr(index) {
    const variableListNow = this.state.variableList;
    variableListNow.splice(index, 1);
    this.setState({
      variableList: [...variableListNow],
    });
  }

  addAttr() {
    const variableListNow = this.state.variableList;
    variableListNow.push({ variableName: '', variableDesc: '' });
    this.setState({
      variableList: [...variableListNow],
    });
  }

  updateAttr(index, key, value) {
    const variableListNow = this.state.variableList;
    variableListNow[index][key] = value;
    this.setState({
      variableList: [...variableListNow],
    });
  }
  handleVariableConfirmHide = () => {
    this.setState({
      variableConfirm: false,
    });
  }
  handleVariableConfirmOk = (variable) => {
    let code = this.state.code;// eslint-disable-line
    for (const key in variable) {
      if (key) {
        const reg = eval('/\\\${' + key + '}/g');// eslint-disable-line
        const codeNow = code.replace(reg, variable[key]);
        code = codeNow;
      }
    }
    this.props.dispatch({
      type: 'graph_query/saveCode',
      payload: { query: code, queryId: this.props.queryId, querySaveName: this.props.querySaveName },// eslint-disable-line
    });
    this.props.dispatch({
      type: 'graph_query/queryGraph',
    });
    this.handleVariableConfirmHide();
  }
  handleVariableConfirm = (again) => {
    const variableListAll = [];
    const nullvariable = [];
    this.state.variableList.map((item, index) => {
      if (item.variableName !== '' && item.variableDesc !== '') {
        variableListAll.push(item);
      }
      return variableListAll;
    });
    let code = this.state.code;// eslint-disable-line
    const searchArr = code.match(/\$\{\w\}/g);
    if (searchArr != null) {
      this.setState({
        variableConfirm: true,
      });
    } else {
      variableListAll.map((item) => {
        const reg = eval('/\\\${' + item.variableName + '}/g');// eslint-disable-line
        const codeNow = code.replace(reg, item.variableDesc);
        code = codeNow;
        return code;
      });
      this.props.dispatch({
        type: 'graph_query/saveCode',
        payload: { query: code, queryId: this.props.queryId, querySaveName: this.props.querySaveName },// eslint-disable-line
      });
      this.props.dispatch({
        type: 'graph_query/queryGraph',
      });
    }
    if (variableListAll.length) {
      if (searchArr != null) {
        searchArr.map((item) => {
          let isExist = false;
          for (let i = 0; i < variableListAll.length; i++) {
            if ( '${'+variableListAll[i].variableName+'}' === item ) {// eslint-disable-line
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            const itemName = item.split('${').join('').split('}');
            nullvariable.push(itemName[0]);
          }
          return nullvariable;
        });
      }
    } else if (searchArr != null) {
      searchArr.map((items) => {
        const itemName = items.split('${').join('').split('}');
        nullvariable.push(itemName[0]);
        return nullvariable;
      });
    }
    this.setState({
      variableRepeat: nullvariable,
      variableListAll,
    });
  }
  render() {
    const editorName = this.state.editorName === '' ? 'Gremlin编辑器' : `正在编辑：${this.state.editorName}`;
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <QueryVariableForm
          dispatch={this.props.dispatch}
          variableConfirm={this.state.variableConfirm}
          handleVariableConfirmHide={this.handleVariableConfirmHide}
          handleVariableConfirmOk={this.handleVariableConfirmOk}
          variableListAll={this.state.variableListAll}
          variableRepeat={this.state.variableRepeat}
        />
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
          <QueryTable onOpen={(query, id, name, variableList, code) => {
            this.setState({
              show: false,
              editorName: name,
              variableList,
              code,
              create: true,
            });
            this.codeMirror.getCodeMirror().setValue(query);
            this.props.dispatch({
              type: 'graph_query/saveCode',
              payload: { query, queryId: id, querySaveName: name, variableList },
            });
          }}
          />
        </Modal>
        <Header style={{ padding: '0px', height: '35px', lineHeight: '35px', background: '#eee' }}>
          <div style={{ marginLeft: '50%', fontWeight: '900' }}>
            项目名称：{this.props.name}
          </div>
        </Header>
        <div style={{ width: '100%', height: 200, background: 'white', position: 'relative' }}>
          <PullUpFrame
            tagClick={this.tagClick}
            className={styles.pullBox}
          >
            <div
              className={this.state.variableRange
                ? styles.queryVariable :
                styles.queryVariableHide
              }
            >
              <QueryVariable
                variableList={this.state.variableList}
                onAddAttr={this.addAttr.bind(this)}
                onRemoveAttr={this.removeAttr.bind(this)}
                onUpdateAttr={this.updateAttr.bind(this)}
              />
            </div>
            <div
              style={{
                width: (this.state.variableRange ? '70%' : '100%'),
                height: 200,
                display: 'inline-block',
                position: 'relative',
              }}
            >
              <div className={styles.variableRangeBox}>
                <i
                  className={this.state.variableRange
                    ? styles.variableRange :
                    styles.variableRangeHide
                  }
                  onClick={this.variableChange}
                />
              </div>
              <div style={{
                width: '100%',
                height: '40px',
                lineHeight: '40px',
                backgroundColor: '#f7f7f8',
                borderBottom: '1px solid #e6e7ea',
                boxSizing: 'border-box',
                }}
              >
                <strong style={{ marginLeft: 40 }}>&nbsp;&nbsp;{editorName}</strong>
                <div style={{
                  float: 'right',
                  // marginBottom: '-6px',
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
                      size="default"
                    >
                      查询管理
                      {/* <Icon type="profile" /> */}
                    </Button>
                    <Button
                      title="保存"
                      onClick={this.handleSaveQueryOk}
                      size="default"
                      disabled={!this.props.inited}
                    >
                      保存
                      {/* <Icon type="save" /> */}
                    </Button>
                    <Button
                      title="另存为"
                      disabled={!this.props.inited}
                      onClick={() => {
                      this.setState({ showSave: true, queryName: '' });
                    }}
                      size="default"
                    >
                      另存为
                      {/* <Icon type="form" /> */}
                    </Button>
                    <Button
                      title="运行"
                      disabled={!this.props.inited}
                      onClick={() => {
                        this.handleVariableConfirm();
                    }}
                      type="primary"
                      size="default"
                    >
                      运行
                      <Icon type="caret-right" />
                    </Button>
                  </Button.Group>
                </div>
              </div>
              <CodeMirror
                ref={(e) => { this.codeMirror = e; }}
                value={this.props.code}
                onChange={(value) => {
                  this.props.dispatch({
                    type: 'graph_query/saveCode',
                    payload: { query: value, queryId: this.props.queryId, querySaveName: this.props.querySaveName },// eslint-disable-line
                  });
                  this.setState({
                    code: value,
                  });
                }}
                className={styles.codeEditor}
                style={{
                  height: 'calc( 100%-50px)',
                }}
                options={{
                  lineNumbers: true,
                  mode: 'gremlin',
                  theme: 'solarized',
              }}
              />
            </div>
          </PullUpFrame>
          <div
            style={{
              background: '#fff',
              padding: '3px 10px',
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
                      height: (
                        this.state.pullBoxRange ?
                        `${window.screen.availHeight - 515}px` :
                        `${window.screen.availHeight - 340}px`
                      ),
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
