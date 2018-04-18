import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Select, Row, Col } from 'antd';
import graphUtils from '../../../utils/graph_utils';
import styles from '../Inspectors.less';


let myDiagram;
let currentInspectedObject;

function getEdgeMappingConfig(type) {
  let data = {
    nodeAttr: '',
    column: '',
  };
  if (currentInspectedObject &&
    currentInspectedObject.data &&
    currentInspectedObject.data[type]) {
    data = { ...currentInspectedObject.data[type] };
  }
  return data;
}
function setEdgeMappingConfig(type, field, value) {
  let config = {};
  if (currentInspectedObject &&
    currentInspectedObject.data &&
    currentInspectedObject.data[type]) {
    config = { ...currentInspectedObject.data[type] };
  }
  config[field] = value;
  myDiagram.model.setDataProperty(currentInspectedObject.data, type, config);
}

function getInspectedObjectMappingData() {
  let data = {};
  if (currentInspectedObject &&
    currentInspectedObject.data &&
    currentInspectedObject.data.mapping) {
    data = { ...currentInspectedObject.data.mapping };
  }
  return data;
}
function setInspectedMappingData(value, name) {
  const mappingData = getInspectedObjectMappingData();
  mappingData[name] = value;
  myDiagram.model.setDataProperty(currentInspectedObject.data, 'mapping', mappingData);
}

class MappingInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      mappingNode: false,
      inited: false,
      tableData: [],
      startNodeAttr: '',
      endNodeAttr: '',
      startColumn: '',
      endColumn: '',
    };
  }
  componentWillReceiveProps(newProp) {
    if (!this.state.inited) {
      myDiagram = graphUtils.getDiagram(newProp.diagramName);
      myDiagram.addDiagramListener('ChangedSelection', () => {
        if (myDiagram.selection.count !== 1) {
          this.setState({
            show: false,
          });
          currentInspectedObject = undefined;
          return;
        }
        currentInspectedObject = myDiagram.selection.first();
        if (!currentInspectedObject || !graphUtils.isLink(currentInspectedObject)) return;
        const show = currentInspectedObject.fromNode.data.category === 'file';
        const mappingNode = show && currentInspectedObject.toNode.data.originType !== 'link';
        const startMappingConfig = getEdgeMappingConfig('start');
        const endMappingConfig = getEdgeMappingConfig('end');
        if (show) {
          this.props.dispatch({
            type: 'graph_mapping_editor/getDataSourceColumns',
            payload: currentInspectedObject.fromNode.data.id,
          });
        }
        this.setState({
          show,
          mappingNode,
          startNodeAttr: startMappingConfig.nodeAttr,
          endNodeAttr: endMappingConfig.nodeAttr,
          startColumn: startMappingConfig.column,
          endColumn: endMappingConfig.column,
        });
      });
      this.setState({ inited: true });
    }
    const tableData = [];
    const mappingData = getInspectedObjectMappingData();
    newProp.currentColumns.forEach((record) => {
      tableData.push({
        name: record,
        mapping: mappingData[record],
      });
    });
    this.setState({
      tableData,
    });
  }
  render() {
    if (!this.state.show) {
      return (<p style={{ textAlign: 'center', fontSize: '16px' }}>暂无选中元素</p>);
    }
    const attrList = graphUtils.getNodeProps(myDiagram, currentInspectedObject.toNode.key);
    const columns = [{
      title: '文件字段',
      dataIndex: 'name',
    },
    {
      title: '属性名称',
      dataIndex: 'mapping',
      render: (text, record, index) => {
        return (
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择属性"
            optionFilterProp="children"
            onChange={(value) => {
              setInspectedMappingData(value, record.name);
              this.state.tableData[index].mapping = value;
              this.setState({});
            }}
            value={record.mapping}
            filterOption={
              (input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            size="small"
          >
            {
              attrList.map(attr =>
                (<Select.Option value={attr} key={attr}>{attr}</Select.Option>))
            }
          </Select>
        );
      },
    }];
    const startNodeProps = this.state.mappingNode ?
      [] : graphUtils.getNodeProps(myDiagram, currentInspectedObject.toNode.data.from);
    const endNodeProps = this.state.mappingNode ?
      [] : graphUtils.getNodeProps(myDiagram, currentInspectedObject.toNode.data.to);
    const linkAttrConfig = (
      <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
        <div className={`${styles.attrBox} ${styles.markdown}`}>
          <div className={styles.boxTitle}>
            <span>端点匹配</span>
          </div>
          <Row>
            <Col offset={6} span={8}><small>节点属性</small></Col>
            <Col span={8}><small>文件字段</small></Col>
          </Row>
          <Row>
            <Col span={6}><strong>&nbsp;&nbsp;&nbsp;起点：</strong></Col>
            <Col span={8}>
              <Select
                showSearch
                size="small"
                style={{ width: '95%' }}
                placeholder="节点属性"
                optionFilterProp="children"
                value={this.state.startNodeAttr}
                onChange={(value) => {
                  setEdgeMappingConfig('start', 'nodeAttr', value);
                  this.setState({ startNodeAttr: value });
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  startNodeProps.map(attr =>
                  (<Select.Option value={attr} key={attr}>{attr}</Select.Option>))
                }
              </Select>
            </Col>
            <Col span={8}>
              <Select
                showSearch
                size="small"
                style={{ width: '95%' }}
                placeholder="文件字段"
                optionFilterProp="children"
                value={this.state.startColumn}
                onChange={(value) => {
                  setEdgeMappingConfig('start', 'column', value);
                  this.setState({ startColumn: value });
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  this.state.tableData.map(attr =>
                  (<Select.Option value={attr.name} key={attr.name}>{attr.name}</Select.Option>))
                }
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={6}><strong>&nbsp;&nbsp;&nbsp;终点：</strong></Col>
            <Col span={8}>
              <Select
                showSearch
                size="small"
                style={{ width: '95%' }}
                placeholder="节点属性"
                optionFilterProp="children"
                value={this.state.endNodeAttr}
                onChange={(value) => {
                  setEdgeMappingConfig('end', 'nodeAttr', value);
                  this.setState({ endNodeAttr: value });
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  endNodeProps.map(attr =>
                  (<Select.Option value={attr} key={attr}>{attr}</Select.Option>))
                }
              </Select>
            </Col>
            <Col span={8}>
              <Select
                showSearch
                size="small"
                style={{ width: '95%' }}
                placeholder="文件字段"
                optionFilterProp="children"
                value={this.state.endColumn}
                onChange={(value) => {
                  setEdgeMappingConfig('end', 'column', value);
                  this.setState({ endColumn: value });
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  this.state.tableData.map(attr =>
                  (<Select.Option value={attr.name} key={attr.name}>{attr.name}</Select.Option>))
                }
              </Select>
            </Col>
          </Row>
        </div>
      </div>
    );
    return (
      <div style={
        {
          background: '#fff',
          padding: '3px',
          margin: '0px 10px',
          height: `${window.screen.availHeight - 253}px`,
          width: '100%',
          overflowY: 'auto',
        }
      }
      >
        {this.state.mappingNode ? (<div />) : linkAttrConfig}
        <div style={{ width: '95%' }}>
          <Table
            columns={columns}
            dataSource={this.state.tableData}
            pagination={false}
            size="small"
            loading={this.props.loadingColumn}
            rowKey={record => `row-${record.name}`}
          />
        </div>
      </div>
    );
  }
}
export default connect(({ graph_mapping_editor }) => {
  return {
    ...graph_mapping_editor,
  };
})(MappingInspector);
