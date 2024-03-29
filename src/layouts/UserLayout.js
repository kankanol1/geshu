import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import { connect } from 'dva';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 观澜数据
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children, title, description } = this.props;
    return (
      <React.Fragment>
        {
          // @TODO <DocumentTitle title={this.getPageTitle()}>
        }
        <div className={styles.bgContainer} />
        <div className={styles.container}>
          {
            // @TODO support multi-lan
          }
          {/* <div className={styles.lang}>
            <SelectLang />
          </div> */}
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src="/img/logo_alpha.png" />
                  <span className={styles.title}>{title}</span>
                </Link>
              </div>
              <div className={styles.desc}>{description}</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ setting }) => ({
  ...setting,
}))(UserLayout);
