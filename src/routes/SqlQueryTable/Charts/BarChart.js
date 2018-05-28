import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord } from 'bizcharts';
import ConfiguredChart from './ConfiguredChart';
import BarChartSettingsForm from './Forms/BarChartSettingsForm';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 145 },
  { year: '1958 年', sales: 48 },
  { year: '1959 年', sales: 38 },
  { year: '1960 年', sales: 38 },
  { year: '1962 年', sales: 38 },
];

const cols = {
  sales: { tickInterval: 20 },
};


export default class BarChart extends ConfiguredChart {
  state = {
  }

  renderConfiguration = (props) => {
    return (
      <BarChartSettingsForm {...props} />
    );
  }

  updateSettings = (displaySettings, dataSettings) => {
    this.setState({ displaySettings, dataSettings });
  }

  renderChart = () => {
    const { displaySettings, dataSettings } = this.state;
    if (displaySettings === undefined || dataSettings === undefined) {
      return null;
    }
    return (
      <Chart height={displaySettings.height} data={data} scale={cols} forceFit>
        <Coord />
        <Axis name={dataSettings.xsource} title />
        <Axis name={dataSettings.ysource} />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="interval" position={`${dataSettings.xsource}*${dataSettings.ysource}`} />
      </Chart>
    );
  }
}
