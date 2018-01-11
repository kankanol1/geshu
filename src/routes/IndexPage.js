import React from 'react';
import { connect } from 'dva';

import TopMenu from '../components/menus/TopMenu';
import RouteWithSubRoutes from './RouteWithSubRoutes';

import { Layout } from 'antd';

function IndexPage({routes}) {  
  return (
    <Layout style={{height:'100%'}}>
    <TopMenu/>
    <Layout style={{height:'100%'}}>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route}/>
    ))}
    </Layout>
  </Layout>
  );
}

IndexPage.propTypes = {
};

export default connect((props) => props)(IndexPage);
