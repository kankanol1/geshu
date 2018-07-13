import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Menu, Icon, Modal, Spin } from 'antd';
// import FileSelector from './FileSelector';
import MappingInspector from './MappingInspector';
import StorageFilePicker from '../../../routes/Storage/StorageFilePicker';

const { confirm } = Modal;
class MappingDesigner extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      datasourceModal: false,
      target: [],
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_mapping_editor/initialize',
      payload: {
        graphContainer: 'myDiagramDiv',
        id: this.props.match.params.id,
      },
    });
  }
  filterOption = (inputValue, option) => {
    return option.name.indexOf(inputValue) > -1;
  }
  handleChange = (v) => {
    // v如果是复选文件，应该是个文件数组对象，如果是单选，也应该用数组包裹起来，方便以后的扩展
    let target = [];
    if (v !== undefined && !Array.isArray(v)) {
      target = [v];
    }
    if (v !== undefined && Array.isArray(v)) {
      target = v;
    }
    this.setState({
      target,
    });
  }
  handleOk = () => {
    this.setState({ datasourceModal: false });
    this.props.dispatch({
      type: 'graph_mapping_editor/addDataSourcesOnGraph',
      payload: this.state.target,
    });
  }
  handleCancel = () => {
    this.setState({ datasourceModal: false });
  }
  render() {
    const { loading } = this.props;
    const { projectId } = this.props.id;

    return (
      <Spin spinning={loading} tip="加载中...">
        <Layout style={{ padding: '0', height: '100%' }} theme="light">
          <Modal
            title="添加数据源"
            visible={this.state.datasourceModal}
            onOk={() => this.handleOk()}
            onCancel={() => this.handleCancel()}
          >
            <StorageFilePicker
              smallSize
              enableUpload
              enableMkdir
              onChange={v => this.handleChange(v)}
              view="index"
              mode="project"
              type="pipeline"
              project={{ id: projectId }}
              allowSelectFolder={false}
              folderOnly={false}
            />
          </Modal>
          <Menu mode="horizontal">
            <Menu.Item >

              <a onClick={() => {
                  this.props.dispatch({
                    type: 'graph_mapping_editor/saveMapping',
                  });
                }}
              >
                <Icon type="save" />
                保存
              </a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={() => {
                this.props.dispatch({
                  type: 'graph_mapping_editor/resetMapping',
                });
              }}
              >
                <Icon type="reload" />重置
              </a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={() => {
                this.setState({ datasourceModal: true });
              }}
              >
                <Icon type="file-add" />添加
              </a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={() => {
                  const self = this;
                  confirm({
                    title: '确定开始导入数据？',
                    content: '系统将会保存当前已进行的操作，并开始数据导入。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                      self.props.dispatch({
                        type: 'graph_mapping_editor/saveMapping',
                        payload: 'execute',
                      });
                    },
                    onCancel() { },
                  });
                }}
              >
                <Icon type="caret-right" />
                运行
              </a>
            </Menu.Item>
            <Menu.Item>
              <a><Icon type="info-circle-o" />关于</a>
            </Menu.Item>
          </Menu>
          <Row>
            <Col span={13} style={{ padding: '0', height: '100%' }}>
              <div
                style={{
                  height: `${window.screen.availHeight - 205}px`,
                  width: '100%',
                  background: '#fff',
                }}
                id="myDiagramDiv"
              />
            </Col>
            <Col span={11}>
              <div style={
                {
                  background: '#fff',
                  padding: '10px 3px',
                  margin: '0px 5px',
                  height: `${window.screen.availHeight - 205}px`,
                  width: '100%',
                }
              }
              >
                <MappingInspector />
              </div>
            </Col>
          </Row>
        </Layout>
      </Spin>
    );
  }
}

export default connect(({ graph_mapping_editor, loading }) => {
  return {
    dataSource: graph_mapping_editor.datasources,
    ...graph_mapping_editor,
    loading: loading.models.graph_mapping_editor,
  };
})(MappingDesigner);

