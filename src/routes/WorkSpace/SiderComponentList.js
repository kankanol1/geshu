import React from 'react';
import {connect} from 'dva';
import { Layout, Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import DraggableWithPreview from '../../components/devcenter/DraggableWithPreview';
import ComponentPreview from './ComponentPreview';
import {fillDefaultSize} from '../../utils/PositionCalculation'

const { Sider } = Layout;
const Panel = Collapse.Panel;

class SiderComponentList extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            preview: null
        }
        this.handlePreviewChange = this.handlePreviewChange.bind(this)
    }

    handlePreviewChange(preview) {
        console.log('handle preview change')
        this.setState({
            preview: preview
        })
    }

    onChange(key) {
        console.log(key);
    }

    render() {
        return <Sider style={{background: 'transparent', height: '100%'}}>
        <Scrollbars>
            <Collapse defaultActiveKey={this.props.work_component_list.activekeys} onChange={this.onChange} >
                {
                    this.props.work_component_list.groups.map(
                        (group) => {
                            return <Panel header={group.name} key={group.key}>
                            {
                                group.components.map(
                                    (component, i) => {
                                        const sizedComponent = fillDefaultSize(component)
                                        return <DraggableWithPreview key={i} 
                                            onItemDragged={(from, to) => this.props.onItemDragged(from, to, sizedComponent)} 
                                            onPreviewChanged={this.handlePreviewChange}
                                            preview={<ComponentPreview component={sizedComponent} />}>
                                            <div style={{cursor: 'default', textAlign: 'center', paddingTop: '5px', paddingBottom: '5px'}}> {component.name} </div>
                                            </DraggableWithPreview>
                                    }
                                )
                            }
                            </Panel>
                        }
                    )
                }
            </Collapse>
        </Scrollbars>
            {this.state.preview}
      </Sider>
    }
}

export default connect((work_component_list) => work_component_list)(SiderComponentList);