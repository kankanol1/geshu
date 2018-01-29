import React from 'react';
import DocumentTitle from 'react-document-title';
import TopMenu from '../components/menus/TopMenu';
import DevMainSideMenu from '../components/menus/DevMainSideMenu';
import { Layout } from 'antd';
import { connect } from 'dva';
import LeftSideMenu from '../components/menus/LeftSideMenu';

class BasicLayout extends React.PureComponent {
    

    render() {
        const layout = <Layout style={{height: '100%'}}>
            <TopMenu/>
            <Layout style={{height: '100%'}}>
                <LeftSideMenu/>
                <div>MDZZ</div>
            </Layout>
        </Layout>

        console.log("rendered")
        return (
            <DocumentTitle title="project x">
            <div style={{height: '100%'}}> {layout}</div>
            </DocumentTitle>

        )
    }
}

export default connect((props) => props)(BasicLayout);