import React from 'react';
import { connect } from 'dva';
import { Menu, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import ScopeMenuItem from './ScopeMenuItem';

const { SubMenu } = Menu;

@connect(
  ({ project, loading }) => ({ project, loading })
)
export default class WorkspaceMenu extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchRecentProjects',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/unloadRecentProjects',
    });
  }

  handleClick(item, key, keypath) {
    const { type } = item.props;
    const { dispatch } = this.props;
    switch (type) {
      case 'redirect':
        dispatch(routerRedux.push(item.props.address));
        break;
      default:
        break;
    }
  }

  renderRecentProjects() {
    const { loading, project } = this.props;
    const { recentProjects } = project;
    if (loading.models.project) {
      return <Menu.Item key="loading"><Spin /></Menu.Item>;
    }
    return (
      recentProjects.data.map(item => (
        <Menu.Item key={item.id} type="redirect" address={`/project/workspace/editor/${item.id}`}>
          {item.name}
        </Menu.Item>
      ))
    );
  }

  render() {
    const { env } = this.props;
    return (
      <Menu
        onClick={({ item, key, keypath }) => this.handleClick(item, key, keypath)}
        selectedKeys={[]}
        mode="horizontal"
        style={{ background: 'transparent', float: 'left' }}
      >
        <SubMenu title={<span>项目</span>}>
          <Menu.Item key="open">打开</Menu.Item>
          <Menu.Item key="close" type="redirect" address="/project/workspace/index">关闭</Menu.Item>
          <SubMenu title={<span>最近打开的项目</span>}>
            {this.renderRecentProjects()}
          </SubMenu>
        </SubMenu>
        <SubMenu title={<span>调试</span>}>
          <ScopeMenuItem scope="editor" env={env} key="hi">测试仅在editor可见</ScopeMenuItem>
          <Menu.Item key="sampledata" >取样执行</Menu.Item>
          <Menu.Item key="samplepipeline">执行至指定组件</Menu.Item>
        </SubMenu>
        <SubMenu title={<span>部署</span>}>
          <Menu.Item key="submit">提交运行</Menu.Item>
        </SubMenu>
        <Menu.Item key="help">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">帮助</a>
        </Menu.Item>
      </Menu>
    );
  }
}
