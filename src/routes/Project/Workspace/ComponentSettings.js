import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Button, Icon } from 'antd';
import BasicParamInput from '../../../components/Inputs/BasicParamInput';
import ComponentSettingsForm from './ComponentSettingsForm';

const { Sider } = Layout;
const { Panel } = Collapse;

class ComponentSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onCloseClicked = this.onCloseClicked.bind(this);
  }

  onCloseClicked(e) {
    this.props.dispatch({
      type: 'work_component_settings/resetCurrentComponent',
    });
  }

  renderSettings = (displaySettings) => {
    return (
      <div>
        {
          Object.entries(displaySettings.properties).map(
            ([k, item]) => {
              return (
                <BasicParamInput
                  key={k}
                  title={item.description}
                  name={k}
                  type={item.title}
                />
              );
            }
          )
        }
      </div>
    );
  }

  render() {
    const { currentComponent, componentSettings } = this.props;
    let displaySettings = null;
    componentSettings.forEach(
      (settings) => {
        if (settings.id === currentComponent) {
          displaySettings = settings;
        }
      }
    );
    if (currentComponent === undefined) {
      return null;
    }

    // build required.
    return (
      <div style={{ background: 'transparent', float: 'right', minWidth: '400px' }}>
        <div style={{ padding: '5px', background: '#fafafa', borderLeft: '1px solid #e8e8e8' }}>
          <Button type="danger" size="small" onClick={this.onCloseClicked}><Icon type="close" />关闭</Button>
          <div style={{ display: 'inline-block', textAlign: 'center', width: '80%' }}>{displaySettings.title}</div>
        </div>
        {
          Object.entries(displaySettings.properties).length === 0 ?
          (
            <div style={{ paddingTop: '20%', textAlign: 'center' }}>
              无可配置项
            </div>
          )
          :
            (
              <ComponentSettingsForm
                properties={displaySettings.properties}
                style={{ paddingTop: '20px', background: '#f5f5f5', height: '100%' }}
              />
            )
        }
      </div>
    );
  }
}

// <BasicParamInput title="csv文件路径" name="path"
//  validator="(e) => true" type="string" tip="the input file path."/>
export default connect(({ work_component_settings }) => work_component_settings)(ComponentSettings);
