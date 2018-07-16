import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Button, Icon, Tooltip, Tag, Modal, Form } from 'antd';
import BaseDisplaySettingsForm from './Forms/BaseDisplaySettingsForm';
import styles from './ConfiguredChart.less';

const ButtonGroup = Button.Group;
const { TabPane } = Tabs;

const ConnectedDisplaySettingsForm = Form.create()(BaseDisplaySettingsForm);

export default class ConfiguredChart extends Component {
  state={
    fullScreen: false,
  }

  getDisplaySettingsForm = () => { return ConnectedDisplaySettingsForm; }
  getDataSettingsForm = () => { return undefined; }

  handleSubmit() {
    const { dataForm, displayForm } = this;
    let displaySettings;
    let dataSettings;

    if (dataForm === undefined) {
      dataSettings = this.state.initialDataSettings;
    } else {
      dataForm.props.form.validateFields((err, values) => {
        if (!err) {
          dataSettings = values;
        }
      });
    }

    if (displayForm === undefined) {
      displaySettings = this.state.initialDisplaySettings;
    } else {
      displayForm.props.form.validateFields((err, values) => {
        if (!err) {
          displaySettings = values;
        }
      });
    }

    if (displaySettings && dataSettings) {
      this.updateSettings(displaySettings, dataSettings);
    }
  }

  toggleFullscreenChart() {
    this.setState({ fullScreen: !this.state.fullScreen });
  }

  renderDisplayConfiguration() {
    const DisplaySF = this.getDisplaySettingsForm();
    return (<DisplaySF
      wrappedComponentRef={(ref) => { this.displayForm = ref; }}
      initialValue={this.state.initialDisplaySettings}
    />
    );
  }

  renderDataConfiguration() {
    const DataSF = this.getDataSettingsForm();
    if (DataSF !== undefined) {
      return (
        <DataSF
          wrappedComponentRef={(ref) => { this.dataForm = ref; }}
          initialValue={this.state.initialDataSettings}
        />
      );
    }
    return null;
  }

  render() {
    // const DataConf = this.renderConfiguration();
    const chart = this.renderChart();
    return (
      <Row>
        <Col span={10}>
          <Card className={styles.leftCard}>
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
                {this.renderDataConfiguration()}
              </TabPane>
              <TabPane tab="展示配置" key="2">
                {this.renderDisplayConfiguration()}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={14}>
          <div>
            {chart ?
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
        {
          this.state.fullScreen ?
            (
              <div
                style={{
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            overflow: 'hidden',
            zIndex: '500',
            background: 'white',
            paddingTop: '50px',
          }}
              >
                <div style={{ textAlign: 'right' }}>
                  <Tooltip title="恢复" placement="leftTop">
                    <Tag onClick={() => this.toggleFullscreenChart()} >
                      <Icon type="shrink" />
                    </Tag>
                  </Tooltip>
                </div>
                {chart}
              </div>
            )
          : null
        }
      </Row>
    );
  }
}
