import React, { Component } from 'react';
import { connect } from 'dva';
import { InputNumber, Modal, Row, Col, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

class GraphFilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNodes: [],
      selectedLinks: [],
    };
  }
  render() {
    const { visible, modelOk, modelCancel } = this.props;
    const { nodeTypes, linkTypes } = this.props.graphProperties;
    return (
      <Modal
        title="选择搜索条件"
        visible={visible}
        onOk={() => { modelOk({ ...this.state }); }}
        onCancel={() => { modelCancel(); }}
      >
        <Row style={{ marginTop: 20, marginLeft: 40 }}>
          <Col span={5}><strong>节点</strong></Col>
          <Col span={18}>
            <CheckboxGroup
              style={{ width: '100%' }}
              onChange={(checked) => {
                  this.setState({
                      selectedNodes: checked,
                  });
              }}
            >
              <Row>
                {
                    Object.keys(nodeTypes).map((key, index) => {
                        return (
                          <Col span={6} key={`nodetype-${index}`}>
                            <Checkbox value={nodeTypes[key].name}>
                              {nodeTypes[key].display}
                            </Checkbox>
                          </Col>
                        );
                    })

                }
              </Row>
            </CheckboxGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: 20, marginLeft: 40 }}>
          <Col span={5}><strong>关系</strong></Col>
          <Col span={18}>
            <CheckboxGroup
              style={{ width: '100%' }}
              onChange={(checked) => {
                  this.setState({
                      selectedLinks: checked,
                  });
              }}
            >
              <Row>
                {
                    Object.keys(linkTypes).map((key, index) => {
                        return (
                          <Col span={6} key={`linktype-${index}`}>
                            <Checkbox value={linkTypes[key].name}>
                              {linkTypes[key].display}
                            </Checkbox>
                          </Col>
                        );
                    })

                }
              </Row>
            </CheckboxGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: 20, marginLeft: 40 }}>
          <Col span={5}><strong>交易金额</strong></Col>
          <Col span={18}>
            <InputNumber
              placeholder="最小金额"
              style={{ display: 'inline-block', width: '40%', marginRight: 10 }}
              value={this.state.minAmount}
              onChange={(value) => {
                  this.setState({ minAmount: value });
              }}
            />
                到
            <InputNumber
              type="Number"
              placeholder="最大金额"
              style={{ display: 'inline-block', width: '40%', marginLeft: 10 }}
              value={this.state.maxAmount}
              onChange={(value) => {
                  this.setState({ maxAmount: value });
              }}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}
export default connect(({ graph_operations, graph_explore }) => {
  return {
    ...graph_operations,
    graphProperties: graph_explore.graphProperties,
  };
})(GraphFilterModal);
