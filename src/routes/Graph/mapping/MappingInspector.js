import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Select, Row, Col, Modal, Tag } from 'antd';
import { routerRedux } from 'dva/router';
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
    currentInspectedObject.data) {
    if (type === 'start') {
      const startPKResult = graphUtils.getNodePKProps(myDiagram,
        currentInspectedObject.toNode.data.from);
      const startPKNodeAttrs = startPKResult.props.filter(o => o.pk === '1').map(o => o.name);
      data.nodeAttr = startPKNodeAttrs.map(o => o).join(',');
      data.column = startPKNodeAttrs.map(o => '').join(',');
    } else {
      const endPKResult = graphUtils.getNodePKProps(myDiagram,
        currentInspectedObject.toNode.data.to);
      const endPKNodeAttrs = endPKResult.props.filter(o => o.pk === '1').map(o => o.name);
      data.nodeAttr = endPKNodeAttrs.map(o => o).join(',');
      data.column = endPKNodeAttrs.map(o => '').join(',');
    }
    if (currentInspectedObject.data[type]) {
      data = { ...currentInspectedObject.data[type] };
    } else {
      currentInspectedObject.data[type] = data;
    }
  }
  return data;
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

class MappingInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      mappingNode: false,
      inited: false,
      tableData: [],
      startColumn: '',
      endColumn: '',
    };
  }

  componentWillReceiveProps(newProp) {
    if (!this.state.inited) {
      myDiagram = graphUtils.getDiagram(newProp.diagramName);
      if (!myDiagram) {
        return;
      }
      myDiagram.addDiagramListener('ChangedSelection', () => {
        if (myDiagram.selection.count !== 1) {
          this.setState({
            show: false,
          });
          return;
        }
        currentInspectedObject = myDiagram.selection.first();
        if (!currentInspectedObject || !graphUtils.isLink(currentInspectedObject)) return;
        const show = currentInspectedObject.fromNode.data.category === 'file';
        const mappingNode = show && currentInspectedObject.toNode.data.originType !== 'link';
        const startMappingConfig = getEdgeMappingConfig('start');
        const endMappingConfig = getEdgeMappingConfig('end');
        const { path, projectId, fileType } = currentInspectedObject.fromNode.data;
        if (show) {
          this.props.dispatch({
            type: 'graph_mapping_editor/getDataSourceColumns',
            payload: {
              path,
              projectId,
              fileType,
            },
          });
        }
        this.setState({
          show,
          mappingNode,
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
  setEdgeMappingConfig = (type, field, value, index) => {
    let config = {};
    if (currentInspectedObject &&
      currentInspectedObject.data &&
      currentInspectedObject.data[type]) {
      config = { ...currentInspectedObject.data[type] };
    }
    const data = config[field].split(',');
    data[index] = value;
    config[field] = data.join(',');
    myDiagram.model.setDataProperty(currentInspectedObject.data, type, config);
    this.props.checkMappingValue(myDiagram, currentInspectedObject);
  }
  setInspectedMappingData = (value, name) => {
    const mappingData = getInspectedObjectMappingData();
    mappingData[name] = value;
    myDiagram.model.setDataProperty(currentInspectedObject.data, 'mapping', mappingData);
    this.props.checkMappingValue(myDiagram, currentInspectedObject);
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
              this.setInspectedMappingData(value, record.name);
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
    const startPKResult = this.state.mappingNode ?
      { vertex: '', props: [] } :
      graphUtils.getNodePKProps(myDiagram, currentInspectedObject.toNode.data.from);
    const endPKResult = this.state.mappingNode ?
      { vertex: '', props: [] } :
      graphUtils.getNodePKProps(myDiagram, currentInspectedObject.toNode.data.to);

    const startPKNodeAttrs = startPKResult.props.filter(o => o.pk === '1').map(o => o.name);
    const endPKNodeAttrs = endPKResult.props.filter(o => o.pk === '1').map(o => o.name);
    const linkAttrConfig = (
      <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
        <div className={`${styles.attrBox} ${styles.markdown}`}>
          <div className={styles.boxTitle}>
            <span>端点匹配</span>
          </div>
          <Row style={{ borderBottom: '1px dashed #ebedf0', paddingBottom: '10px' }} type="flex" justify="space-around" align="middle">

            <Col offset={6} span={12}>
              <Row>
                <Col span={12}><strong>文件字段</strong></Col>
                <Col span={12}><strong>节点属性</strong></Col>
              </Row>
            </Col>
            <Col span={6}><strong>节点</strong></Col>
          </Row>
          <Row style={{ borderBottom: '1px dashed #ebedf0', paddingBottom: '10px', paddingTop: '10px' }} type="flex" justify="space-around" align="middle">
            <Col span={6} style={{ textAlign: 'center' }}><strong>起点：</strong></Col>
            <Col span={12}>
              {
                startPKNodeAttrs.map((o, index) => {
                  return (
                    <Row>
                      <Col span={12}>
                        <Select
                          showSearch
                          size="small"
                          style={{ width: '95%' }}
                          placeholder="文件字段"
                          optionFilterProp="children"
                          value={this.state.startColumn ? this.state.startColumn.split(',')[index] : ''}
                          onChange={(value) => {
                            this.setEdgeMappingConfig('start', 'column', value, index);
                            const { startColumn } = this.state;
                            const startData = startColumn.split(',');
                            startData[index] = value;
                            this.setState({ startColumn: startData.join(',') });
                          }}
                          filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            this.state.tableData.map(attr =>
                              (
                                <Select.Option value={attr.name} key={attr.name}>
                                  {attr.name}
                                </Select.Option>
                              )
                            )
                          }
                        </Select>
                      </Col>
                      <Col span={12}>
                        <Tag style={{ padding: '0 10px' }}>
                          {o}
                        </Tag>
                      </Col>
                    </Row>
                  );
                })
              }
            </Col>
            <Col span={6} style={{ textAlign: 'left' }}><strong>{startPKResult.vertex}</strong></Col>
          </Row>
          <Row style={{ paddingTop: '10px' }} type="flex" justify="space-around" align="middle">
            <Col span={6} style={{ textAlign: 'center' }}><strong>终点：</strong></Col>
            <Col span={12}>
              {
                endPKNodeAttrs.map((o, index) => {
                  return (
                    <Row>
                      <Col span={12}>
                        <Select
                          showSearch
                          size="small"
                          style={{ width: '95%' }}
                          placeholder="文件字段"
                          optionFilterProp="children"
                          value={this.state.endColumn ? this.state.endColumn.split(',')[index] : ''}
                          onChange={(value) => {
                            this.setEdgeMappingConfig('end', 'column', value, index);
                            const { endColumn } = this.state;
                            const endData = endColumn.split(',');
                            endData[index] = value;
                            this.setState({ endColumn: endData.join(',') });
                          }}
                          filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            this.state.tableData.map(attr =>
                              (
                                <Select.Option value={attr.name} key={attr.name}>
                                  {attr.name}
                                </Select.Option>
                              )
                            )
                          }
                        </Select>
                      </Col>
                      <Col span={12}>
                        <Tag style={{ padding: '0 10px' }}>
                          {o}
                        </Tag>
                      </Col>
                    </Row>
                  );
                })
              }
            </Col>
            <Col span={6} style={{ textAlign: 'left' }}><strong>{endPKResult.vertex}</strong></Col>
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
            // loading={this.props.loadingColumn}
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
