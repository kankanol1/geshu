import React from 'react';

import { connect } from 'dva';
import { Layout, Collapse, Button } from 'antd';
import BasicParamInput from '../../components/WorkSpace/BasicParamInput';
import work_component_settings from '../../models/workspace/work_component_settings';

const { Sider } = Layout;
const Panel = Collapse.Panel;

const size = 'default'

class ComponentSettings extends React.PureComponent {


    constructor(props) {
        super(props);
        this.onCloseClicked = this.onCloseClicked.bind(this)
    }

    onChange(key){
        console.log(key);
    }

    onCloseClicked(e) {
        this.props.dispatch({
            type: 'work_component_settings/resetCurrentComponent',
        })
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
        if (currentComponent === undefined) {
            return null;
        }
        return <Sider style={{background: 'transparent'}} width='400'>
        <div style={{padding: '8px',background:'#fafafa', borderLeft: '1px solid #e8e8e8'}}>
            <Button type="danger" size={size} onClick={this.onCloseClicked}>关闭</Button>
        </div>
        <Collapse defaultActiveKey={['required', 'optional']} onChange={this.onChange}>
            <Panel header="必填项" key="required">
                {
                    displaySettings.required === undefined || displaySettings.required.length === 0 ? <div>无必填项</div> :
                    displaySettings.required.map(
                        (item, i) => {
                            return <BasicParamInput key={i} title={item.description} name={item.name} type={item.type} tip={item.tip} validator={item.validator}/>
                        }
                    )
                }
            </Panel>
            <Panel header="可选项" key="optional">
                {
                    displaySettings.optional === undefined || displaySettings.optional.length === 0 ? <div>无可选项</div> :
                    displaySettings.optional.map(
                        (item, i) => {
                            return <BasicParamInput key={i} title={item.description} name={item.name} type={item.type} tip={item.tip} validator={item.validator}/>
                        }
                    )
                }
            </Panel>
        </Collapse>
      </Sider>
    }
}

//<BasicParamInput title="csv文件路径" name="path" validator="(e) => true" type="string" tip="the input file path."/>
export default connect(({work_component_settings}) => work_component_settings)(ComponentSettings);