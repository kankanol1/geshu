import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Radio } from 'antd';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;


/** the creation form. */
class GraphExploreTitleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountSelect: 'account_id',
      personSelect: 'name',
    };
  }
  onSelectChange = (v, type) => {
    if (type === 'Account') {
      this.setState({
        accountSelect: v.target.value,
      });
    } else {
      this.setState({
        personSelect: v.target.value,
      });
    }
  }
  render() {
    const { visible, modelOk, modelCancel } = this.props;
    const nodeSelectList = {};
    const GraphProperties = this.props.graphProperties;
    Object.keys(GraphProperties.nodeTypes).forEach((item) => {
      nodeSelectList[item] = [];
      Object.keys(GraphProperties.nodeTypes[item].properties).forEach((property) => {
        nodeSelectList[item].push({
          label: GraphProperties.nodeTypes[item].properties[property],
          value: property,
        });
      });
    });
    return (
      <Modal
        title="选择元素显示名称"
        visible={visible}
        onOk={() => { modelOk({ ...this.state }); }}
        onCancel={() => { modelCancel(); }}
      >
        {
            Object.keys(nodeSelectList).map((key) => {
             return (
               <Row style={{ marginTop: 15, marginLeft: 20 }} key={key}>
                 <Col span={3} style={{ marginTop: 5 }}><strong>{key === 'Account' ? '账户' : '人员'}</strong></Col>
                 <Col span={21}>
                   <RadioGroup
                     defaultValue={nodeSelectList[key][0].value}
                     onChange={v => this.onSelectChange(v, key)}
                   >
                     {
                        nodeSelectList[key].map((item) => {
                          return <RadioButton value={item.value} style={{ display: 'inline-block', width: '32%', marginRight: '1.3%', marginTop: 5, fontSize: 14 }}>{item.label}</RadioButton>;
                        })
                      }

                   </RadioGroup>
                 </Col>
               </Row>
            );
            })
          }
      </Modal>
    );
  }
}
export default connect(({ graph_operations, graph_explore }) => {
  return {
    ...graph_operations,
    graphProperties: graph_explore.graphProperties,
  };
})(GraphExploreTitleModal);
