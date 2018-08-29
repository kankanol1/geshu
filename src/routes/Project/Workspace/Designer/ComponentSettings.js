import React from 'react';
import { connect } from 'dva';
import { Collapse, Button, Icon, Spin, Modal } from 'antd';
import BasicParamInput from '../../../../components/Inputs/BasicParamInput';
import ComponentSettingsForm from './ComponentSettingsForm';
import translateName from '../../../../config/ComponentNameMapping';

@connect(({ work_component_settings }) => ({
  work_component_settings,
}))
export default class ComponentSettings extends React.PureComponent {
  onCloseClicked(e) {
    const closeSettingsPane = () => {
      this.props.dispatch({
        type: 'work_component_settings/resetCurrentComponent',
      });
      // clear selection.
      this.props.dispatch({
        type: 'workcanvas/canvasClearSelection',
      });
    };
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
    const { loading } = this.props.work_component_settings;
    const displaySettings = componentSettings[currentComponent];
    if (!loading && !displaySettings) {
      // means already being deleted.
      return null;
    }
    // build required.
    return (
      <Modal
        title={loading ? '加载中...' : displaySettings === undefined ? '未获取到配置' : translateName(displaySettings.title)}
        visible
        footer={null}
        // onOk={() => this.handleOk()}
        onCancel={() => this.onCloseClicked()}
        destroyOnClose
        width={800}
      >
        {/* <div className={styles.workSettingDiv}> */}
        <div style={{ height: '500px' }}>
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
      </Modal>
    );
  }
}
