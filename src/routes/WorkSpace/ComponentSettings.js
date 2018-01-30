import React from 'react';

import { Layout, Collapse, Button } from 'antd';
import BasicParamInput from '../../components/WorkSpace/BasicParamInput';

const { Sider } = Layout;
const Panel = Collapse.Panel;

const size = 'default'

class ComponentSettings extends React.PureComponent {

    onChange(key){
        console.log(key);
    }

    render() {
        return <Sider style={{background: 'transparent'}} width='400'>
        <div style={{padding: '8px',background:'#fafafa', borderLeft: '1px solid #e8e8e8'}}>
            <Button type="primary" size={size}>保存</Button>
            <Button type="danger" size={size} style={{float: 'right'}}>重置</Button>
        </div>
        <Collapse defaultActiveKey={['required', 'optional']} onChange={this.onChange}>
            <Panel header="必填项" key="required">
                <BasicParamInput title="csv文件路径" name="path" validator="(e) => true" type="string" tip="the input file path."/>
            </Panel>
            <Panel header="可选项" key="optional">
                <div>Hi there</div>
            </Panel>
        </Collapse>
      </Sider>
    }
}

export default ComponentSettings;