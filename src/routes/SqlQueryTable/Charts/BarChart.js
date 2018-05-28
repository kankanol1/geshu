import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord } from 'bizcharts';
import ConfiguredChart from './ConfiguredChart';
import BarChartSettingsForm from './Forms/BarChartSettingsForm';
import BarChartDisplaySettingsForm from './Forms/BarChartDisplaySettingsForm';

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

const DataSettingForm = Form.create()(BarChartSettingsForm);
const DisplaySettingForm = Form.create()(BarChartDisplaySettingsForm);

export default class BarChart extends ConfiguredChart {
  state = {
    initialDisplaySettings: {
      height: 400,
      enablex: true,
      enabley: true,
    },
    initialDataSettings: {
      xsource: 'year',
      ysource: 'sales',
      table: 'whatever',
    },
  }

  getDataSettingsForm = () => {
    return DataSettingForm;
  }

  getDisplaySettingsForm = () => {
    return DisplaySettingForm;
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
        <Coord transpose={displaySettings.transpose ? true : undefined} />
        {displaySettings.enablex ?
          <Axis name={dataSettings.xsource} title />
        : null
        }
        {
          displaySettings.enabley ?
            <Axis name={dataSettings.ysource} />
          : null
        }
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="interval" position={`${dataSettings.xsource}*${dataSettings.ysource}`} />
      </Chart>
    );
  }
}
