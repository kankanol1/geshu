import React from 'react';

import { Layout, Collapse } from 'antd';

const { Sider } = Layout;
const Panel = Collapse.Panel;

class ComponentSettings extends React.PureComponent {

    onChange(key){
        console.log(key);
    }

    render() {
        return <Sider style={{background: 'transparent'}} width='400'>
        
        <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
            <Panel header="Basic settings" key="1">
                <div>Hi there</div>
            </Panel>
            <Panel header="Extend settings" key="2">
                <div>Hi there</div>
            </Panel>
            <Panel header="Other settings" key="3">
                <p>Needs to be added.</p>
            </Panel>
        </Collapse>
      </Sider>
    }
}

export default ComponentSettings;