import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';


class GraphExploreTooltip extends Component {
  buildNodeTooltip=() => {
    const GraphProperties = this.props.graphProperties;
    const { tooltipData } = this.props;
    if (!tooltipData.propertyList ||
      !GraphProperties.nodeTypes[tooltipData.type].properties) { return null; }
    return this.buildPropertyList(tooltipData.propertyList,
      GraphProperties.nodeTypes[tooltipData.type].properties);
  }
  buildLinkTooltip=() => {
    const GraphProperties = this.props.graphProperties;
    const { dataMap } = this.props.tooltipData;
    if (!dataMap) { return null; }
    const tooltipList = [];
    for (const linkId in dataMap) {
      if (dataMap[linkId].propertyList &&
        GraphProperties.linkTypes[dataMap[linkId].type].properties) {
        tooltipList.push(this.buildPropertyList(dataMap[linkId].propertyList,
          GraphProperties.linkTypes[dataMap[linkId].type].properties)
        );
      }
    }
    return (
      <div style={{ position: 'relative', maxHeight: '300px', overflowY: 'auto' }}>
        {
          tooltipList.map((tooltip, tooltipIndex) => {
            return (
              <div
                key={`linkTooltip-${tooltipIndex}`}
                style={{
                  width: tooltipIndex % 2 === 0 && tooltipIndex === tooltipList.length - 1 ? '98%' : '47%',
                  float: 'left',
                  display: 'inline',
                  borderLeft: '2px solid #ccc',
                  margin: '0 0 10px 2px',
                }}
              >
                {tooltip}
              </div>
            );
          })
        }
      </div>
    );
  }
  buildLinkTooltipTitle=() => {
    const GraphProperties = this.props.graphProperties;
    if (this.props.startNode) {
      return (
        <span>
          <strong>起点：</strong>{this.props.startNode.name}<br />
          <strong>终点：</strong>{this.props.endNode.name}<br />
          <strong>类型：</strong>{GraphProperties.linkTypes[this.props.tooltipData.type].display}<br />
          <strong>数量：</strong>{this.props.tooltipData.text.split('(')[1].split(')')[0]}<br />
        </span>
      );
    }
    return null;
  }
  buildPropertyList=(propertyList, mapping) => {
    return (
      <div>
        {
          propertyList.map((value, index) => {
          if (mapping[value.key] && value.value) {
            return (
              <span key={`tooltip-${index}`}>
                <strong>
                  { mapping[value.key]}:
                </strong>
                {value.value}
                <br />
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  }
  render() {
    const GraphProperties = this.props.graphProperties;
    return (
      this.props.tooltipData ? (
        <div
          style={{
          position: 'absolute',
          top: this.props.top,

          left: this.props.left,
          display: this.props.show ? 'block' : 'none',
          zIndex: 100,
        }}
        >
          <Card
            title={this.props.isNode ?
                `${this.props.tooltipData.name}(${GraphProperties.nodeTypes[this.props.tooltipData.type].display})`
                : this.buildLinkTooltipTitle()}
            type="inner"
            style={{
                maxWidth: 450,
              }}
          >
            {
               this.props.isNode ? this.buildNodeTooltip() : this.buildLinkTooltip()
             }
          </Card>
        </div>
      ) : null
    );
  }
}
export default connect(({ graph_operations, graph_explore }) => {
  return {
    ...graph_operations,
    graphProperties: graph_explore.graphProperties,
  };
})(GraphExploreTooltip);
