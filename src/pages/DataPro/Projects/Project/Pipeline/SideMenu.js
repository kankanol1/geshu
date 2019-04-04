import React from 'react';
import { Collapse, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';

import IOConfig from './Configs/IO/Index';
import styles from './SideMenu.less';
import { getIconNameForComponent } from './Canvas/styles';

const { Panel } = Collapse;

@connect(({ dataproConfig, loading }) => ({
  config: dataproConfig.components,
  loading: loading.effects['dataproConfig/fetchConfig'],
}))
class SideMenu extends React.PureComponent {
  state = {
    // for dialog display.
    addingComponent: undefined,
    activeKeys: [],
    collapse: false,
    // addingComponent: {
    //   name: 'PrepareTransformer',
    //   code: 'PrepareTransformer',
    // },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'dataproConfig/fetchConfig',
    });
  }

  componentWillReceiveProps(props) {
    if (this.state.activeKeys.length === 0) {
      this.setState({
        activeKeys: Object.keys(props.config),
      });
    }
  }

  handleOnClicked = (type, name, code) => {
    const { id } = this.props;
    // if (type === 'DataSource') {
    //   // redirect.
    //   router.push(`/projects/p/pipeline/add/${id}/${code}`);
    // } else {
    // only add code here.
    this.setState({ addingComponent: { code, name } });
    // }
  };

  renderComponent = (type, name, code) => {
    const icon = getIconNameForComponent(code);
    return (
      <div
        key={`${code}-display`}
        className={styles.component}
        onClick={e => {
          e.preventDefault();
          this.handleOnClicked(type, name, code);
        }}
      >
        <i className={`x-icon-small ${icon}`} />
        <span className={styles.componentName}>
          {formatMessage({
            id: `operator.${name}`,
            defaultMessage: name,
          })}
        </span>
      </div>
    );
  };

  render() {
    const { config, loading, id } = this.props;
    const { addingComponent, collapse } = this.state;
    return (
      <div className={styles.menuWrapper} style={{ left: collapse ? '-380px' : '0' }}>
        <div className={styles.menu}>
          <Spin spinning={loading}>
            <Collapse
              bordered={false}
              activeKey={this.state.activeKeys}
              onChange={key => {
                this.setState({ activeKeys: key });
              }}
            >
              {Object.keys(config).map(i => (
                <Panel
                  header={formatMessage({
                    id: `operatortype.${i}`,
                    defaultMessage: i,
                  })}
                  key={i}
                >
                  {config[i].map(item => this.renderComponent(i, item.name, item.code))}
                </Panel>
              ))}
            </Collapse>
            {// render dialog if needed.
            addingComponent && (
              <IOConfig
                type="new"
                id={this.props.id}
                title={`添加组件 ${formatMessage({
                  id: `operator.${addingComponent.name}`,
                  defaultMessage: addingComponent.name,
                })}`}
                component={addingComponent}
                onOk={operatorId => {
                  this.setState({ addingComponent: undefined }, () => {
                    router.push(`/projects/p/pipeline/${id}/new/${operatorId}`);
                  });
                }}
                onCancel={() => this.setState({ addingComponent: undefined })}
              />
            )}
          </Spin>
        </div>
        <div
          className={styles.collapseBar}
          onClick={() => this.setState({ collapse: !collapse })}
        />
      </div>
    );
  }
}

export default SideMenu;
