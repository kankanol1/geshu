import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon, Spin, Tooltip, Alert, Tabs, Modal } from 'antd';
import BarChart from './Charts/BarChart';

export default class VisualizationModal extends Component {
  getChartTypes() {
    return [
      {
        name: '柱状图',
        thumbnail: 'test',
        render: <BarChart name={this.props.sql} />,
      },
    ];
  }

  render() {
    const { onSelected } = this.props;
    return (
      <div>
        {this.getChartTypes().map(
          (chart, i) => {
            return <Button key={i} onClick={() => onSelected(chart)}>{chart.name}</Button>;
          }
        )}
      </div>
    );
  }
}

VisualizationModal.propTypes = {
  onSelected: PropTypes.func.isRequired,
};
