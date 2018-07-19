import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Checkbox, Tooltip, Icon, Select, Switch, Tag } from 'antd';
import styles from '../Inspectors.less';
import DynamicAttributeEditor from './DynamicAttributeEditor';
import graphUtils from '../../../utils/graph_utils';


let myDiagram;
let currentInspectedObject;
const defaultData = {
  text: '',
  partition: false,
  useStatic: false,
  unidirected: false,
  multiplicity: 'MULTI',
};

function getInspectedObjectData() {
  let data;
  if (currentInspectedObject && currentInspectedObject.data) {
    data = { ...currentInspectedObject.data };
  }
  for (const key in defaultData) {
    if (!data[key]) data[key] = defaultData[key];
  }
  if (!data.attrList) data.attrList = [];
  return data;
}

function setInspectedObjectData(name, value) {
  myDiagram.model.setDataProperty(currentInspectedObject.data, name, value);
}

const multiplicityTypes = ['MULTI', 'SIMPLE', 'MANY2ONE', 'ONE2MANY', 'ONE2ONE'];
class ElementInspector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNode: false,
      show: false,
    };
  }

  componentWillReceiveProps(newProp) {
    const diagram = graphUtils.getDiagram(this.props.diagramName);
    if (diagram) {
      myDiagram = diagram;
      myDiagram.addDiagramListener('ChangedSelection', () => {
        if (myDiagram.selection.count !== 1) {
          this.setState({
            show: false,
          });
          currentInspectedObject = undefined;
          return;
        }
        currentInspectedObject = myDiagram.selection.first();
        if (!currentInspectedObject) return;
        const data = getInspectedObjectData();
        data.show = true;
        data.isNode = graphUtils.isNode(currentInspectedObject);
        if (!data.isNode) {
          data.fromNodePK = currentInspectedObject.fromNode.data.attrList.filter(obj => obj.pk === '1');
          data.fromNodeText = currentInspectedObject.fromNode.data.text;
          data.toNodePK = currentInspectedObject.toNode.data.attrList.filter(obj => obj.pk === '1');
          data.toNodeText = currentInspectedObject.toNode.data.text;
        }
        this.setState(data);
      });

      myDiagram.addDiagramListener('TextEdited', () => {
        if (currentInspectedObject) {
          this.setState({
            show: true,
            text: getInspectedObjectData().text,
          });
        }
      });
    }
  }
  getInspectedObjectData = (inspectedObject) => {
    let data;
    if (inspectedObject && inspectedObject.data) {
      data = { ...inspectedObject.data };
    }
    for (const key in defaultData) {
      if (!data[key]) data[key] = defaultData[key];
    }
    if (!data.attrList) data.attrList = [];
    return data;
  }
  removeAttr(index) {
    this.state.attrList.splice(index, 1);
    setInspectedObjectData('attrList', this.state.attrList);
    this.setState({});
  }

  addAttr() {
    const defaultProp = { name: '', type: 'String', cardinality: 'SINGLE', pk: '0' };
    if (this.state.attrList.length < 1) {
      defaultProp.pk = '1';
    }
    this.state.attrList.push(defaultProp);
    setInspectedObjectData('attrList', this.state.attrList);
    this.setState({});
  }

  updateAttr(index, key, value) {
    this.state.attrList[index][key] = value;
    setInspectedObjectData('attrList', this.state.attrList);
    this.setState({});
  }

  inputChanged = (stateKey, event) => {
    this.state[stateKey] = event.target.value;
    this.setState({});
    setInspectedObjectData(stateKey, event.target.value);
  }
  render() {
    if (!this.state.show) {
      return (<p style={{ textAlign: 'center', fontSize: '16px' }}>暂无选中元素</p>);
    }
    let vertexConfig = (<div />);
    if (!this.state.isNode) {
      vertexConfig = (
        <div style={{ marginBottom: '2px', textAlign: 'center', paddingLeft: '20px', paddingRight: '20px' }}>
          <Row gutter={2} style={{ borderBottom: '1px dashed #ebedf0', paddingBottom: '10px' }} type="flex" justify="space-around" align="middle">
            <Col span={6}><strong>起点</strong></Col>
            <Col span={6}>
              <strong>{this.state.fromNodeText}</strong>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              {
                this.state.fromNodePK.map((attr) => {
                  return (
                    <Tag style={{ lineHeight: '28px', height: '30px', padding: '0 10px', marginBottom: '4px', marginTop: '2px' }}>
                      {attr.name}
                    </Tag>
                  );
                })
              }
            </Col>
          </Row>
          <Row gutter={2} style={{ paddingTop: '10px' }} type="flex" justify="space-around" align="middle">
            <Col span={6}><strong>终点</strong></Col>
            <Col span={6}>
              <strong>{this.state.toNodeText}</strong>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              {
                this.state.toNodePK.map((attr) => {
                  return (
                    <Tag style={{ lineHeight: '28px', height: '30px', padding: '0 10px', marginBottom: '2px', marginTop: '2px' }}>
                      {attr.name}
                    </Tag>
                  );
                })
              }
            </Col>
          </Row>
        </div>
      );
    }
    let attrConfig = (<div />);
    if (this.state.isNode) {
      attrConfig = (
        <div>
          <Row className={styles.attrItem}>
            <Col span={9} offset={4}>
              <Checkbox
                checked={this.state.partition}
                onChange={(e) => {
                    this.state.partition = e.target.checked;
                    this.setState({});
                    setInspectedObjectData('partition', e.target.checked);
                  }}
              >
                <strong>Partition</strong>
                <Tooltip title="Allowed cardinality of the values associated with the key on any given vertex">
                  <Icon type="question-circle" />
                </Tooltip>
              </Checkbox>
            </Col>
            <Col span={9}>
              <Checkbox
                checked={this.state.useStatic}
                onChange={(e) => {
                    this.state.useStatic = e.target.checked;
                    this.setState({});
                    setInspectedObjectData('useStatic', e.target.checked);
                  }}
              >
                <strong>Static</strong>
                <Tooltip title="Allowed cardinality of the values associated with the key on any given vertex">
                  <Icon type="question-circle" />
                </Tooltip>
              </Checkbox>
            </Col>
          </Row>
        </div>
      );
    } else {
      attrConfig = (
        <div>
          <Row className={styles.attrItem}>
            <Col span={7} style={{ textAlign: 'right' }}>
              <strong >Unidirected&nbsp;</strong>
              <Tooltip title="Allowed cardinality of the values associated with the key on any given vertex">
                <Icon type="question-circle" />
              </Tooltip>
              &nbsp;&nbsp;
            </Col>
            <Col span={9}>
              <Switch
                checked={this.state.unidirected}
                onChange={(checked) => {
                    this.state.unidirected = checked;
                    this.setState({});
                    setInspectedObjectData('unidirected', checked);
                  }}
              />,
            </Col>
          </Row>
          <Row className={styles.attrItem}>
            <Col span={7} style={{ textAlign: 'right' }}>
              <strong >Multiplicity&nbsp;</strong>
              <Tooltip title="Allowed cardinality of the values associated with the key on any given vertex">
                <Icon type="question-circle" />
              </Tooltip>
              &nbsp;&nbsp;
            </Col>
            <Col span={9}>
              <Select
                showSearch
                style={{ width: '100%' }}
                optionFilterProp="children"
                filterOption={
                        (input, option) => {
                          return option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0;
                        }
                      }
                value={this.state.multiplicity}
                onChange={(event) => {
                        this.state.multiplicity = event;
                        this.setState({});
                        setInspectedObjectData('multiplicity', event);
                      }}
              >
                {multiplicityTypes.map((value, index) => {
                  return (<Select.Option value={value} key={index}>{value}</Select.Option>);
                })}
              </Select>
            </Col>
          </Row>
        </div>
      );
    }


    return (
      <div>
        <div className={styles.attrItem}>
          <Input
            placeholder="元素名称"
            style={{ width: '95%' }}
            onChange={this.inputChanged.bind({}, 'text')}
            value={this.state.text}
          />
        </div>
        <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
          <div className={`${styles.attrBox} ${styles.markdown}`}>
            <div className={styles.boxTitle}>
              <span>元素配置</span>
            </div>
            {attrConfig}
          </div>
        </div>
        {
          !this.state.isNode ? (
            <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
              <div className={`${styles.attrBox} ${styles.markdown}`}>
                <div className={styles.boxTitle}>
                  <span>端点属性</span>
                </div>
                {vertexConfig}
              </div>
            </div>
            ) : null
        }
        <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
          <div className={`${styles.attrBox} ${styles.markdown}`}>
            <div className={styles.boxTitle}>
              <span>属性配置</span>
            </div>
            <DynamicAttributeEditor
              attrList={this.state.attrList}
              onAddAttr={this.addAttr.bind(this)}
              onRemoveAttr={this.removeAttr.bind(this)}
              onUpdateAttr={this.updateAttr.bind(this)}
              isNode={this.state.isNode}
            />
          </div>
        </div>
        {
          this.state.isNode ?
        (
          <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
            <div className={`${styles.attrBox} ${styles.markdown}`}>
              <div className={styles.boxTitle}>
                <span>颜色配置</span>
              </div>
              <div style={{ display: 'inline-block', marginLeft: 5 }}>背景色</div>
              <Input
                style={{ display: 'inline-block', width: '30%', marginLeft: 5 }}
                type="color"
                value={this.state.color}
                onChange={(event) => {
                this.setState({
                  color: event.target.value,
                });
                setInspectedObjectData('color', event.target.value);
              }}
              />
              <div style={{ display: 'inline-block', marginLeft: 30 }}>字体色</div>
              <Input
                style={{ display: 'inline-block', width: '30%', marginLeft: 5 }}
                type="color"
                value={this.state.stroke}
                onChange={(event) => {
                this.setState({
                  stroke: event.target.value,
                });
                setInspectedObjectData('stroke', event.target.value);
              }}
              />
            </div>

          </div>
          ) : null
        }
      </div>
    );
  }
}
export default connect(({ graph_schema_editor }) => {
  return { ...graph_schema_editor };
})(ElementInspector);
