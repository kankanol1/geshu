import React from 'react';
import { connect } from 'dva';
import { Tabs, Card, Icon } from 'antd';

import BasicSettings from './Settings/BasicSettings';
import MarkdownSettings from './Settings/MarkdownSettings';
import MemberSettings from './Settings/MemberSettings';
import ProjectSettings from './Settings/ProjectSettings';

const { TabPane } = Tabs;

@connect(({ dataproProject, loading }) => ({
  dataproProject,
  loading: loading.models.dataproProject,
}))
class Settings extends React.PureComponent {
  state = {
    key: 'basic',
  };

  handleTabChange = v => {
    this.setState({ key: v });
  };

  render() {
    const { id } = this.props.match.params;

    return (
      <Card>
        <Tabs activeKey={this.state.key} onChange={v => this.handleTabChange(v)}>
          <TabPane
            tab={
              <span>
                <Icon type="bars" />
                基本设置
              </span>
            }
            key="basic"
          >
            <BasicSettings id={id} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="file-markdown" />
                项目说明
              </span>
            }
            key="markdown"
          >
            <MarkdownSettings id={id} />
          </TabPane>
          {/* <TabPane
            tab={
              <span>
                <Icon type="team" />
                成员管理
              </span>
            }
            key="members"
          >
            <MemberSettings id={id} />
          </TabPane> */}
          <TabPane
            tab={
              <span>
                <Icon type="project" />
                项目管理
              </span>
            }
            key="projects"
          >
            <ProjectSettings id={id} />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default Settings;
