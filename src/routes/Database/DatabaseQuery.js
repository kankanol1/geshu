import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import QueryTable from './Query/QueryTable';
import SiderBar from './Query/SiderBar';
import styles from './DatabaseQuery.less';

export default class DatabaseQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docked: true,
      open: true,
    };
  }

  toggleSideBar() {
    this.setState({
      docked: !this.state.docked,
      open: !this.state.open,
    });
  }

  renderMain() {
    return (
      <React.Fragment>
        <QueryTable />
        <div className={styles.toggleTrigger} >
          <Icon type={this.state.open ? 'double-left' : 'double-right'} onClick={() => this.toggleSideBar()} />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const drawerOptions = { docked: this.state.docked, open: this.state.open, position: 'left', transitions: true };
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light" >
        <Drawer sidebar={<SiderBar />} {...drawerOptions} className={styles.drawer}>
          {this.renderMain()}
        </Drawer>
      </Layout>
    );
  }
}
