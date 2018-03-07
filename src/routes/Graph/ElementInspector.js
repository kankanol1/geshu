/* eslint-disable */
import React, { Component } from 'react';
import { Input, Icon, Button, Row, Col, InputNumber } from 'antd';
import styles from './ElementInspector.less';
import DynamicAttributeEditor from './DynamicAttributeEditor';
import graphUtils from './GraphUtils';


let myDiagram;
let currentInspectedObject;
let self;

function getInspectedObjectData() {
  let data;
  if (currentInspectedObject && currentInspectedObject.data) {
    data = { ...currentInspectedObject.data };
  }
  data.text = data.text ? data.text : '';
  data.attrList = data.attrList ? data.attrList : [];
  data.color = data.color ? data.color : '#ffffff';
  data.stroke = data.stroke ? data.stroke : '#000000';
  data.loc = data.loc ? data.loc : { x: 0, y: 0 };
  return data;
}

function setInspectedObjectData(name, value) {
  myDiagram.model.setDataProperty(currentInspectedObject.data, name, value);
}

function selectionChangedListener(diagramEvent) {
  if (myDiagram.selection.count !== 1) {
    self.setState({
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
  self.setState(data);
}

function textEditedListener(diagramEvent) {
  if (currentInspectedObject) {
    self.setState({
      show: true,
      text: getInspectedObjectData().text,
    });
  }
}

function selectionMovedListener(diagramEvent) {
  if (currentInspectedObject) {
    self.setState({
      show: true,
      loc: getInspectedObjectData().loc,
    });
  }
}

export default class ElementInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNode: false,
      show: false,
      text: '',
      attrList: [],
      color: '',
      stroke: '',
      loc: { x: 0, y: 0 },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.diagram) return;

    self = this;
    myDiagram = nextProps.diagram;

    myDiagram.removeDiagramListener('ChangedSelection', selectionChangedListener);
    myDiagram.removeDiagramListener('TextEdited', textEditedListener);
    myDiagram.removeDiagramListener('SelectionMoved', selectionMovedListener);

    myDiagram.addDiagramListener('ChangedSelection', selectionChangedListener);
    myDiagram.addDiagramListener('TextEdited', textEditedListener);
    myDiagram.addDiagramListener('SelectionMoved', selectionMovedListener);
  }

  removeAttr(index) {
    this.state.attrList.splice(index, 1);
    setInspectedObjectData('attrList', this.state.attrList);
    this.setState({});
  }

  addAttr() {
    this.state.attrList.push({ name: '', type: 'string' });
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

  locationInputChanged = (stateKey, event) => {
    const location = this.state.loc;
    location[stateKey] = event;
    this.setState({ location });
    myDiagram.model.setDataProperty(currentInspectedObject.data, 'loc', location);
    currentInspectedObject.position = location;
  }


  render() {
    if (!this.state.show) {
      return (<p style={{ textAlign: 'center', fontSize: '16px' }}>暂无选中元素</p>);
    }

    let nodeAttr = (<div/>);
    if (this.state.isNode) {
      nodeAttr = (
        <div className={styles.attrItem} style={{ width: '95%', marginTop: '10px' }}>
          <div className={`${styles.attrBox} ${styles.markdown}`}>
            <div className={styles.boxTitle}>
              <span>元素配置</span>
            </div>
            <Row className={styles.attrItem}>
              <Col span={5}><p style={{ textAlign: 'right' }}>背景：</p></Col>
              <Col span={6}><Input
                type="color"
                value={this.state.color}
                onChange={this.inputChanged.bind({}, 'color')}
              />
              </Col>
              <Col span={5}><p style={{ textAlign: 'right' }}>边框：</p></Col>
              <Col span={6}>
                <Input
                  type="color"
                  onChange={this.inputChanged.bind({}, 'stroke')}
                />
              </Col>
            </Row>
            <Row className={styles.attrItem}>
              <Col span={5}><p style={{ textAlign: 'right' }}>X：</p></Col>
              <Col span={6}><InputNumber
                value={this.state.loc.x}
                onChange={this.locationInputChanged.bind({}, 'x')}
                style={{ width: '100%' }}
                formatter={(value) => {
                  if (value) {
                    return parseFloat(value).toFixed(2);
                  }
                  return value;
                }}
              />
              </Col>
              <Col span={5}><p style={{ textAlign: 'right' }}>Y：</p></Col>
              <Col span={6}><InputNumber
                value={this.state.loc.y}
                style={{ width: '100%' }}
                onChange={this.locationInputChanged.bind({}, 'y')}
                formatter={(value) => {
                  if (value) {
                    return parseFloat(value).toFixed(2);
                  }
                  return value;
                }}
              />
              </Col>
            </Row>
          </div>
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
        {nodeAttr}
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
            />
          </div>
        </div>


      </div>
    );
  }
}
