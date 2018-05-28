import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Button, Icon, Tooltip, Tag, Modal } from 'antd';
import FullScreen from 'react-fullscreen';
import DisplaySettingsForm from './Forms/DisplaySettingsForm';

const ButtonGroup = Button.Group;
const { TabPane } = Tabs;

// const FormHolder = Form.create()();

export default class ConfiguredChart extends Component {
  state={
    // fullScreen: false,
  }

  handleSubmit() {
    let displaySettings;
    let dataSettings;
    this.dataForm.props.form.validateFields((err, values) => {
      if (!err) {
        dataSettings = values;
      }
    });
    this.displayForm.props.form.validateFields((err, values) => {
      if (!err) {
        displaySettings = values;
      }
    });
    if (displaySettings && dataSettings) {
      this.updateSettings(displaySettings, dataSettings);
    }
  }

  // toggleFullscreenChart() {
  //   this.setState({ fullScreen: true });
  // }

  renderDisplayConfiguration() {
    return (<DisplaySettingsForm
      wrappedComponentRef={(ref) => { this.displayForm = ref; }}
    />
    );
  }

  render() {
    // const DataConf = this.renderConfiguration();
    const chart = this.renderChart();
    return (
      <Row>
        <Col span={8}>
          <Card>
            <Tabs
              defaultActiveKey="1"
              tabBarExtraContent={
                <ButtonGroup>
                  <Button>
                    <Tooltip title="保存设置">
                      <Icon type="plus" />
                    </Tooltip>
                  </Button>
                  <Button type="primary" onClick={() => this.handleSubmit()}>
                    <Tooltip title="生成图表">
                      <Icon type="play-circle-o" />
                    </Tooltip>
                  </Button>
                </ButtonGroup>
        }
            >
              <TabPane tab="数据配置" key="1">
                {this.renderConfiguration({
                  wrappedComponentRef: (ref) => { this.dataForm = ref; } })}
              </TabPane>
              <TabPane tab="展示配置" key="2">
                {this.renderDisplayConfiguration()}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={16}>
          <div>
            {chart !== undefined && chart !== null ?
            (
              <React.Fragment>
                <div style={{ textAlign: 'right' }}>
                  <Tooltip title="全屏">
                    <Tag onClick={() => this.toggleFullscreenChart()} >
                      <Icon type="arrows-alt" />
                    </Tag>
                  </Tooltip>
                </div>
                {chart}
              </React.Fragment>
            )
            : null
            }
          </div>
        </Col>
        {
          // render a fullscreen modal chart.
        }
      </Row>
    );
  }
}
