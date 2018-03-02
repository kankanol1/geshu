import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SiderSingleComponent from './SiderSingleComponent';
import FilterCardList from '../../List/Applications';

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
      type: 'work_component_list/fetchComponentList',
    });
  }

  handlePreviewChange(preview) {
    this.setState({
      preview,
    });
  }

  handleSearch = (filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'work_component_list/filterComponent',
      payload: {
        filter,
      },
    });
  }

  render() {
    const { activekeys, groups } = this.props.work_component_list;
    return (
      <Sider style={{ background: 'transparent' }}>
        <Search
          placeholder="Filter"
          onSearch={value => this.handleSearch(value)}
          style={{ width: 200, padding: '5px' }}
        />
        {/* the hight of scrollbars should be 100%-hight of search input */}
        <Scrollbars style={{ height: 'calc( 100% - 42px)' }}>
          <Collapse
            defaultActiveKey={activekeys}
            onChange={this.onChange}
          >
            {
              groups.map(
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
  work_component_list => work_component_list
)(SiderComponentList);
