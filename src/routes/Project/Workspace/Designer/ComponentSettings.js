import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Button, Icon, Spin } from 'antd';
import BasicParamInput from '../../../../components/Inputs/BasicParamInput';
import ComponentSettingsForm from './ComponentSettingsForm';
import translateName from '../../../../config/ComponentNameMapping';
import styles from './WorkArea.less';

const { Sider } = Layout;
const { Panel } = Collapse;

@connect(({ work_component_settings, loading }) => ({
  work_component_settings,
  loading: loading.models.work_component_settings,
}))
export default class ComponentSettings extends React.PureComponent {
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
    const { currentComponent, componentSettings } = this.props.work_component_settings;
    if (currentComponent === undefined) {
      return null;
    }
    const { loading } = this.props;
    const displaySettings = componentSettings[currentComponent];

    if (!loading && !displaySettings) {
      // means already being deleted.
      return null;
    }
    // build required.
    return (
      <div className={styles.workSettingDiv}>
        <div style={{ padding: '5px', background: '#fafafa', borderLeft: '1px solid #e8e8e8' }}>
          <Button type="danger" size="default" onClick={this.onCloseClicked} disabled={loading} >
            <Icon type={loading ? 'loading' : 'close'} />
          </Button>
          <div style={{ display: 'inline-block', textAlign: 'center', width: '80%' }}>
            { loading ? '加载中...' : displaySettings === undefined ? '未获取到配置' : translateName(displaySettings.title)}
          </div>
        </div>
        { loading ? (
          <div style={{ paddingTop: '20%', textAlign: 'center' }}>
            <Spin />
          </div>)
          :
          (displaySettings.properties === undefined ||
            Object.entries(displaySettings.properties).length === 0 ?
          (
            <div style={{ paddingTop: '20%', textAlign: 'center' }}>
              无可配置项
            </div>
          )
          :
            (
              <ComponentSettingsForm
                match={this.props.match}
                style={{ paddingTop: '20px', background: '#f5f5f5', height: '100%', zIndex: 200 }}
              />
            )
          )
        }
      </div>
    );
  }
}
