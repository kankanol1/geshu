import React from 'react';
import { Collapse, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';

import Input1Output1Config from './Configs/Input1Output1Config';
import styles from './SideMenu.less';
import { getIconNameForComponent } from './Canvas/styles';

const { Panel } = Collapse;

// render config for other components.
const renderConfig = {
  AddLiteralColumnTransformer: Input1Output1Config,
  PrepareTransformer: Input1Output1Config,
};

@connect(({ dataproConfig, loading }) => ({
  config: dataproConfig.components,
  loading: loading.effects['dataproConfig/fetchConfig'],
}))
class SideMenu extends React.PureComponent {
  state = {
    // for dialog display.
    addingComponent: undefined,
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

  handleOnClicked = (type, name, code) => {
    const { id } = this.props;
    if (type === 'source') {
      // redirect.
      router.push(`/projects/p/pipeline/add/${id}/${code}`);
    } else {
      this.setState({ addingComponent: { name, code } });
    }
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
    const { config, loading } = this.props;
    const { addingComponent } = this.state;
    let displayAdding = null;
    if (addingComponent) {
      const Widget = renderConfig[addingComponent.code];
      displayAdding = (
        <Widget
          id={this.props.id}
          title={`添加组件 ${formatMessage({
            id: `operator.${addingComponent.name}`,
            defaultMessage: addingComponent.name,
          })}`}
          // type.
          type={addingComponent.code}
          onOk={v => {
            this.props.dispatch({
              type: 'dataproPipeline/loadPipeline',
              payload: {
                id: this.props.id,
              },
              callback: () => this.setState({ addingComponent: undefined }),
            });
          }}
          onCancel={() => this.setState({ addingComponent: undefined })}
        />
      );
    }
    return (
      <div className={styles.menuWrapper}>
        <Spin spinning={loading}>
          <Collapse bordered={false} activeKey={Object.keys(config)}>
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
          {
            // render dialog if needed.
            displayAdding
          }
        </Spin>
      </div>
    );
  }
}

export default SideMenu;
