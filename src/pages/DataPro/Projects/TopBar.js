import React from 'react';
import { Icon, Dropdown, Menu, Avatar, Spin } from 'antd';
import router from 'umi/router';
import hash from 'object-hash';
import Identicon from 'identicon.js';
import XTopBar from '@/components/XTopBar';

export default class TopBar extends React.PureComponent {
  render() {
    const { id, title, path, dispatch, currentUser, fullScreen } = this.props;
    const { avatar, userName } = currentUser;
    let displayAvatar = null;
    if (avatar !== undefined) {
      displayAvatar = avatar;
    } else if (userName !== undefined) {
      const imgData = new Identicon(hash(userName), 32).toString();
      displayAvatar = `data:image/png;base64,${imgData}`;
    }
    return (
      <XTopBar
        title={title}
        back="/projects/list"
        location={path}
        leftMenus={[
          {
            tooltip: '左侧菜单',
            key: 'menu',
            selected: !fullScreen,
            content: <Icon type="menu" />,
            onClick: () => {
              dispatch({
                type: 'global/changeFullScreen',
                payload: !fullScreen,
              });
            },
          },
          {
            tooltip: '返回项目列表',
            key: 'list',
            content: <Icon type="appstore" />,
            link: '/projects/list',
          },
        ]}
        rightMenus={[
          {
            tooltip: '概览',
            key: 'overview',
            link: `/projects/p/show/${id}`,
            selected: path === `/projects/p/show/${id}`,
            content: <Icon type="profile" />,
          },
          {
            tooltip: '数据处理流程',
            key: 'pipeline',
            selected: path === `/projects/p/pipeline/${id}`,
            link: `/projects/p/pipeline/${id}`,
            content: <Icon type="share-alt" />,
          },
          {
            tooltip: '数据集',
            key: 'dataset',
            selected: path === `/projects/p/dataset/${id}`,
            link: `/projects/p/dataset/${id}`,
            content: <Icon type="file-text" />,
          },
          {
            tooltip: '看板',
            key: 'dashboard',
            selected: path === `/projects/p/dashboard/${id}`,
            link: `/projects/p/dashboard/${id}`,
            content: <Icon type="fund" />,
          },
          {
            tooltip: '历史版本',
            key: 'versions',
            selected: path === `/projects/p/versions/${id}`,
            link: `/projects/p/versions/${id}`,
            content: <Icon type="clock-circle" />,
          },
          {
            tooltip: '项目设置',
            key: 'settings',
            selected: path === `/projects/p/settings/${id}`,
            link: `/projects/p/settings/${id}`,
            content: <Icon type="setting" />,
          },
          {
            key: 'user',
            content: (
              <Spin spinning={!userName}>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      selectedKeys={[]}
                      onClick={({ key }) => {
                        if (key === 'self') {
                          router.push('/self');
                        } else if (key === 'logout') {
                          dispatch({
                            type: 'login/logout',
                          });
                        }
                      }}
                    >
                      <Menu.Item key="self">
                        <Icon type="user" />
                        个人中心
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="logout">
                        <Icon type="logout" />
                        退出登录
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Avatar size="small" src={displayAvatar} />
                </Dropdown>
              </Spin>
            ),
          },
        ]}
      />
    );
  }
}
