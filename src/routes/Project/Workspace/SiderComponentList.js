import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SiderSingleComponent from './SiderSingleComponent';

const { Sider } = Layout;
const { Panel } = Collapse;
const { Search } = Input;

class SiderComponentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
    };
    this.handlePreviewChange = this.handlePreviewChange.bind(this);
  }

  componentDidMount() {
    // fetch data.
    const { dispatch } = this.props;
    dispatch({
      type: 'work_component_list/featchComponentList',
    });
  }

  handlePreviewChange(preview) {
    this.setState({
      preview,
    });
  }

  render() {
    return (
      <Sider style={{ background: 'transparent', height: '100%', float: 'left' }}>
        <Search
          placeholder="Filter"
          onSearch={value => console.log(value)}
          style={{ width: 200, padding: '5px' }}
        />
        <Scrollbars>
          <Collapse
            defaultActiveKey={this.props.work_component_list.activekeys}
            onChange={this.onChange}
          >
            {
              this.props.work_component_list.groups.map(
                (group) => {
                  return (
                    <Panel header={group.name} key={group.key}>
                      {
                        group.components.map(
                          (component, i) => {
                            return (
                              <SiderSingleComponent
                                key={`${group.key}-${i}`}
                                kei={`${group.key}-${i}`}
                                name={component.name}
                                component={component}
                                onItemDragged={this.props.onItemDragged}
                                handlePreviewChange={this.handlePreviewChange}
                              />
                            );
                          }
                        )
                      }
                    </Panel>
                  );
                }
              )
            }
          </Collapse>
        </Scrollbars>
        {this.state.preview}
      </Sider>
    );
  }
}

export default connect(
  (work_component_list) => { return work_component_list; }
)(SiderComponentList);
