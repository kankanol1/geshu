import React, { Component } from 'react';
import { Button, Spin, Divider } from 'antd';
import { connect } from 'dva';
import GraphNodeCategories from './config/GraphNodeCategories';
import GraphToolBar from './config/GraphToolBar';
import GraphUtils from '../../../utils/graph_utils';
import GraphTooltip from './GraphTooltip';
import GraphFilterModal from './GraphFilterModal';
import GraphExploreTitleModal from './GraphExploreTitleModal';

class GraphOperation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledButtons: [],
    };
  }
  componentWillMount() {
    GraphToolBar.forEach((group) => {
      group.tools.forEach((tool) => {
        if (tool.defaultDisable) this.state.disabledButtons.push(tool.name);
      });
    });
    this.setState({
      disabledButtons: [...this.state.disabledButtons] });
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_explore/initialize',
      payload: {
        afterInit: this.props.afterInit,
        container: 'container',
        id: this.props.paramsId,
        categories: GraphNodeCategories,
        dblClick: (currentObject) => {
          this.props.dispatch({
            type: 'graph_explore/exploreGraph',
            payload: currentObject,
          });
        },
        hideTooltip: () => {
          this.props.dispatch({
            type: 'graph_operations/toggleTooltip',
            payload: {
              showTip: false,
            },
          });
        },
        showTip: (e, obj) => {
          const mousePt = this.props.graphObject.diagram.lastInput.viewPoint;
          this.props.dispatch({
            type: 'graph_operations/toggleTooltip',
            payload: {
              isNode: GraphUtils.isNode(obj),
              showTip: true,
              top: `${mousePt.y + 10}px`,
              left: `${mousePt.x + 10}px`,
              tooltipData: obj.data,
              startNode: GraphUtils.isNode(obj) ? null : obj.fromNode.data,
              endNode: GraphUtils.isNode(obj) ? null : obj.toNode.data,
            },
          });
        },
      },
    });
  }
  handleTitleOk = (values) => {
    const graph = this.props.graphObject;
    this.props.dispatch({
      type: 'graph_operations/toggleSetTitleModal',
      payload: false,
    });
    const formatter = (node) => {
      let accountData = '';
      let personData = '';
      if (node.data.type === 'Account') {
        node.data.propertyList.forEach((item) => {
          if (item.key === values.accountSelect) {
            accountData = item.value;
          }
        });
        return accountData;
      } else if (node.data.type === 'Person') {
        node.data.propertyList.forEach((item) => {
          if (item.key === values.personSelect) {
            personData = item.value;
          }
        });
        return personData;
      }
    };
    graph.setNodeLable(formatter);
  }
  handleTitleCancel = () => {
    this.props.dispatch({
      type: 'graph_operations/toggleSetTitleModal',
      payload: false,
    });
  }
  handleModalOk = (values) => {
    this.props.dispatch({
      type: 'graph_operations/toggleFilterModal',
      payload: false,
    });
    const graph = this.props.graphObject;
    graph.doDrawGraph([(node) => {
      return values.selectedNodes.indexOf(node.type) >= 0;
    }], [(link) => {
      let ret = values.selectedLinks.indexOf(link.type) >= 0;
      if (ret && link.type === 'Transaction') {
        link.propertyList.forEach((property) => {
          if (property.key === 'real_amount') {
            ret = ret &&
              (!values.minAmount ||
                (values.minAmount && property.value >= values.minAmount));
            ret = ret &&
              (!values.maxAmount ||
                (values.maxAmount && property.value <= values.maxAmount));
          }
        });
      }
      return ret;
    }]);
  }
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'graph_operations/toggleFilterModal',
      payload: false,
    });
  }

  render() {
    const GraphProperties = this.props.graphProperties;
    const graph = this.props.graphObject;
    let labelColor = {};
    const colorObject = {};
    if (graph) {
      labelColor = graph.label2Color;
      if (labelColor) {
        for (const item in labelColor) {
          if (item) {
            colorObject[item] = labelColor[item];
          }
        }
        for (const item in GraphNodeCategories) {
          if (item) {
            colorObject[item] = GraphNodeCategories[item].fill;
          }
        }
      }
    }
    return (
      <div
        style={{
        position: 'relative',
        background: 'white',
        marginTop: '5px',
        overflow: 'hiddern',
      }}
      >
        <GraphExploreTitleModal
          visible={this.props.selectTitleModal}
          modelOk={this.handleTitleOk}
          modelCancel={this.handleTitleCancel}
        />
        <GraphFilterModal
          visible={this.props.filterModalVisable}
          modelOk={this.handleModalOk}
          modelCancel={this.handleModalCancel}
        />
        <GraphTooltip
          position={this.props.position}
          show={this.props.showTip}
          isNode={this.props.isNode}
          tooltipData={this.props.tooltipData}
          startNode={this.props.startNode}
          endNode={this.props.endNode}
        />
        <Spin size="large" spinning={this.props.operationLoading}>
          <div
            id="toolbarContainer"
            style={{
                background: 'white',
                padding: 8,
                boxShadow: '1px 0px 2px #ccc',
              }}
          >
            {GraphToolBar.map((toolGroup, groupIndex) => {
              return (
                <div key={`toolGroup${groupIndex}`} style={{ display: 'inline-block', marginRight: 5 }}>
                  <Divider type="vertical" />
                  {toolGroup.display}:&nbsp;&nbsp;
                  {
                    toolGroup.tools.map((tool, toolIndex) => {
                      return (
                        <Button
                          // size="small"
                          key={`toolGroup${toolIndex}`}
                          title={tool.display}
                          disabled={this.state.disabledButtons.indexOf(tool.name) >= 0}
                          onClick={() => {
                            const newButtonStatus = tool.onclick(this.props.dispatch, graph);
                            if (!newButtonStatus) return;
                            const { enable, disable } = newButtonStatus;
                            if (enable) {
                              enable.forEach((value) => {
                                const index = this.state.disabledButtons.indexOf(value);
                                if (index >= 0) {
                                  this.state.disabledButtons.splice(index, 1);
                                }
                              });
                            }
                            if (disable) {
                              disable.forEach((value) => {
                                const index = this.state.disabledButtons.indexOf(value);
                                if (index < 0) {
                                  this.state.disabledButtons.push(value);
                                }
                              });
                            }
                            this.setState({
                              disabledButtons: [...this.state.disabledButtons],
                            });
                          }}
                        >
                          {tool.icon}
                        </Button>
                      );
                    })
                  }
                </div>
              );
            })}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, right: 30 }}>
              {
            JSON.stringify(colorObject) !== '{}' ?
              (
              Object.keys(colorObject).map((key) => {
               return (
                 <p style={{ overflow: 'hiddern' }} key={key}>
                   <span style={{ display: 'inline-block', width: 30, height: 20, borderRadius: 5, background: colorObject[key], marginRight: 20, float: 'left' }} />
                   <span style={{ display: 'inline-block', float: 'left' }}>
                     {GraphProperties.nodeTypes[key] ?
                      GraphProperties.nodeTypes[key].display
                      : GraphNodeCategories[key].display}
                   </span>
                 </p>
              );
              })
            ) : null

          }
            </div>
            <div
              id="container"
              style={{
              minHeight: this.props.diagramHight,
              width: '100%',
            }}
            />
          </div>
        </Spin>
      </div>
    );
  }
}
export default connect(({ graph_operations, graph_explore }) => {
  return {
    ...graph_operations,
    graphProperties: graph_explore.graphProperties,
  };
})(GraphOperation);
