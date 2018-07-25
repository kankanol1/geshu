import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Button, Icon, Spin, Modal } from 'antd';
import BasicParamInput from '../../../../components/Inputs/BasicParamInput';
import ComponentSettingsForm from './ComponentSettingsForm';
import translateName from '../../../../config/ComponentNameMapping';
import styles from './WorkArea.less';

@connect(({ work_component_settings, loading }) => ({
  work_component_settings,
  loading: loading.models.work_component_settings,
}))
export default class ComponentSettings extends React.PureComponent {
  onCloseClicked(e) {
    const closeSettingsPane = () =>
      this.props.dispatch({
        type: 'work_component_settings/resetCurrentComponent',
      });
    const { dirty } = this.props.work_component_settings.display;
    const { dispatch, match: { params: { id: projectId } } } = this.props;
    if (dirty) {
      Modal.confirm({
        title: '关闭确认',
        content: '有未保存更改，是否保存？',
        onOk() {
          dispatch({
            type: 'work_component_settings/saveCurrentComponentSettings',
            payload: {
              id: projectId,
            },
            callback: () => closeSettingsPane(),
          });
        },
        onCancel() {
          closeSettingsPane();
        },
      });
    } else {
      closeSettingsPane();
    }
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
          <Button type="danger" size="default" onClick={e => this.onCloseClicked(e)} disabled={loading} >
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
