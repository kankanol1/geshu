import React from 'react';
import { Tabs, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';

const { TabPane } = Tabs;

@connect((_, { history }) => ({
  history,
}))
class SelfManage extends React.PureComponent {
  handleChange(key) {
    const { url, params } = this.props.match;
    const { tab } = params;
    if (tab === undefined) {
      this.props.dispatch(routerRedux.push(`${url}/${key}`));
    } else {
      this.props.dispatch(routerRedux.push(`${url.replace(tab, key)}`));
    }
  }

  render() {
    const { tab } = this.props.match.params;
    const selected = tab === 'basic' || tab === 'password' ? tab : 'basic';
    return (
      <Card>
        <Tabs defaultActiveKey={selected} activeKey={selected} onChange={k => this.handleChange(k)}>
          <TabPane tab="基本信息" key="basic">
            <BasicInfo />
          </TabPane>
          <TabPane tab="修改密码" key="password">
            <ChangePassword />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default SelfManage;
