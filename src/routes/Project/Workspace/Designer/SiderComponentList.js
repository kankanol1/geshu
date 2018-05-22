import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Input, Spin } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SiderSingleComponent from './SiderSingleComponent';

const { Sider } = Layout;
const { Panel } = Collapse;
const { Search } = Input;

@connect(({ work_component_list, loading }) => ({
  work_component_list, loading: loading.models.work_component_list,
}))
export default class SiderComponentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      // store offset of the scrollbar.
      offsetY: 0,
    };
    this.handlePreviewChange = this.handlePreviewChange.bind(this);
  }

  componentDidMount() {
    // fetch data.
    const { dispatch } = this.props;
    const { state } = this.props.work_component_list;
    if (state.lastSync <= 0) {
      dispatch({
        type: 'work_component_list/fetchComponentList',
      });
    }
  }

  handlePreviewChange(preview) {
    if (preview === null) {
      this.setState({
        ...this.state,
        preview: null,
      });
    } else {
      const displayPreview = React.cloneElement(preview, { style: {
        ...preview.props.style,
        ...{
          top: `${parseInt(preview.props.style.top, 0) - this.state.offsetY}px`,
        },
      } });
      this.setState({
        preview: displayPreview,
      });
    }
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

  handleScroll = (event) => {
    this.setState({
      ...this.state,
      offsetY: event.target.scrollTop,
    });
  }

  render() {
    const { activekeys, groups } = this.props.work_component_list;
    const { loading } = this.props;
    if (loading) {
      return (
        <Sider style={{ background: 'transparent', paddingTop: '200px', textAlign: 'center' }}>
          <Spin />
        </Sider>
      );
    }
    return (
      <Sider style={{ background: 'transparent' }}>
        <Search
          placeholder="搜索组件"
          onSearch={value => this.handleSearch(value)}
          style={{ width: 200, padding: '5px' }}
        />
        {/* the hight of scrollbars should be 100%-hight of search input */}

        {

          groups.length === 0 ?
          (
            <div style={{ paddingTop: '200px', textAlign: 'center' }}>无相应组件</div>
          )
          :
          (
            <Scrollbars style={{ height: 'calc( 100% - 42px)' }} onScroll={this.handleScroll}>
              <Collapse
                defaultActiveKey={activekeys}
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
          )
        }

        {this.state.preview}
      </Sider>
    );
  }
}

