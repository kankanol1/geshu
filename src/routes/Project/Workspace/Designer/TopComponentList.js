import React from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Input, Spin, Tabs } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SiderSingleComponent from './SiderSingleComponent';
import TopSingleComponent from './TopSingleComponent';
import FloatDrawerTrigger from '../../../../components/FloatDrawerTrigger';
import styles from './WorkArea.less';

const { Sider } = Layout;
const { Panel } = Collapse;
const { Search } = Input;
const { TabPane } = Tabs;

@connect(({ work_component_list, loading }) => ({
  work_component_list, loading: loading.models.work_component_list,
}))
export default class TopComponentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      // store offset of the scrollbar.
      offsetY: 0,
      showTop: true,
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

  handleComponentWheelScroll = (e) => {
    const { deltaX, deltaY } = e;
    const maxDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    const left = this.scrollbar.getScrollLeft();
    // already at the left;
    if (maxDelta < 0 && left === 0) return;
    const width = this.scrollbar.getScrollWidth();
    const displayWidth = this.scrollbar.getClientWidth();
    // alreay at the right;
    if (width === displayWidth) return;
    this.scrollbar.scrollLeft(left + maxDelta);
  }

  render() {
    const { activekeys, groups } = this.props.work_component_list;
    const { loading } = this.props;
    if (loading) {
      return null;
    }
    return (
      <div className={styles.topTabWrapper}>
        {
          <Tabs type="card" style={{ height: this.state.showTop ? undefined : '0px' }} className={styles.topTabs}>
            {
                  groups.map(
                    (group) => {
                      return (
                        group.components.length === 0 ? null :
                        (
                          <TabPane tab={group.name} key={group.key}>
                            <Scrollbars
                              ref={(e) => { this.scrollbar = e; }}
                              style={{ height: '100px', whiteSpace: 'nowrap' }}
                              onWheel={e => this.handleComponentWheelScroll(e)}
                            >
                              {
                                group.components.map(
                                  (component, i) => {
                                    return (
                                      <TopSingleComponent
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
                            </Scrollbars>
                          </TabPane>
                        )
                      );
                    }
                  )
                }
          </Tabs>
        }
        <FloatDrawerTrigger
          position="bottom"
          open={this.state.showTop}
          toggle={() => this.setState({ showTop: !this.state.showTop })}
          style={{ bottom: 'auto' }}
        />

        {this.state.preview}
      </div>
    );
  }
}

