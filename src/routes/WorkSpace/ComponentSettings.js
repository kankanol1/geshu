import React from 'react';

import { connect } from 'dva';
import { Layout, Collapse, Button } from 'antd';
import BasicParamInput from '../../components/WorkSpace/BasicParamInput';
import work_component_settings from '../../models/workspace/work_component_settings';

const { Sider } = Layout;
const Panel = Collapse.Panel;

const size = 'default'

class ComponentSettings extends React.PureComponent {

    onChange(key){
        console.log(key);
    }

    render() {
        const {currentComponent, componentSettings} = this.props;
        let displaySettings = null;
        componentSettings.forEach(
            settings => {
                if (settings.id === currentComponent) {
                    displaySettings = settings;
                }
            }
        )
        if (currentComponent === undefined || displaySettings.required === undefined) {
            return null;
        }
        return <Sider style={{background: 'transparent'}} width='400'>
        <div style={{padding: '8px',background:'#fafafa', borderLeft: '1px solid #e8e8e8'}}>
            <Button type="primary" size={size}>保存</Button>
            <Button type="danger" size={size} style={{float: 'right'}}>重置</Button>
        </div>
        <Collapse defaultActiveKey={['required', 'optional']} onChange={this.onChange}>
            <Panel header="必填项" key="required">
                {
                    displaySettings.required.map(
                        item => {
                            <BasicParamInput title={item.description} name={item.name} type={item.type} tip={item.tip} />
                        }
                    )
                }
            </Panel>
            <Panel header="可选项" key="optional">
                <div>Hi there</div>
            </Panel>
        </Collapse>
      </Sider>
    }
}

//<BasicParamInput title="csv文件路径" name="path" validator="(e) => true" type="string" tip="the input file path."/>
export default connect(({work_component_settings}) => work_component_settings)(ComponentSettings);