import React from 'react';
import { Collapse, Modal } from 'antd';
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

const config = {
  source: {
    name: '数据源',
    items: [
      {
        name: 'FileDataSource',
        code: 'FileDataSource',
      },
      {
        name: 'JdbcDataSource',
        code: 'JdbcDataSource',
      },
      {
        name: 'AvroDataSource',
        code: 'AvroDataSource',
      },
    ],
  },
  process: {
    name: '数据处理',
    items: [
      {
        name: 'AddLiteralColumnTransformer',
        code: 'AddLiteralColumnTransformer',
      },
      {
        name: 'RandomSplitTransformer',
        code: 'RandomSplitTransformer',
      },
      {
        name: 'UnionTransformer',
        code: 'UnionTransformer',
      },
      {
        name: 'ColumnSplitTransformer',
        code: 'ColumnSplitTransformer',
      },
      {
        name: 'AggregateTransformer',
        code: 'AggregateTransformer',
      },
      {
        name: 'FilterTransformer',
        code: 'FilterTransformer',
      },
      {
        name: 'ProjectTransformer',
        code: 'ProjectTransformer',
      },
      {
        name: 'JoinTransformer',
        code: 'JoinTransformer',
      },
      {
        name: 'PrepareTransformer',
        code: 'PrepareTransformer',
      },
    ],
  },
  sink: {
    name: '数据存储',
    items: [],
  },
};

@connect(() => ({}))
class SideMenu extends React.PureComponent {
  state = {
    // for dialog display.
    // addingComponent: undefined,
    addingComponent: {
      name: 'PrepareTransformer',
      code: 'PrepareTransformer',
    },
  };

  handleOnClicked = (type, name, code) => {
    const { id } = this.props;
    if (type === 'source') {
      // redirect.
      router.push(`/projects/p/op/add/${id}/${code}/`);
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
    const { addingComponent } = this.state;
    let displayAdding = null;
    if (addingComponent) {
      const Widget = renderConfig[addingComponent.code];
      displayAdding = (
        <Widget
          title={`添加组件 ${formatMessage({
            id: `operator.${addingComponent.name}`,
            defaultMessage: addingComponent.name,
          })}`}
          // type.
          type={addingComponent.code}
          onOk={v => {
            this.props.dispatch({
              type: 'dataproPipeline/loadPipeline',
              callback: () => this.setState({ addingComponent: undefined }),
            });
          }}
          onCancel={() => this.setState({ addingComponent: undefined })}
        />
      );
    }
    return (
      <div className={styles.menuWrapper}>
        <Collapse bordered={false} defaultActiveKey={Object.keys(config)}>
          {Object.keys(config).map(i => (
            <Panel header={config[i].name} key={i}>
              {config[i].items.map(item => this.renderComponent(i, item.name, item.code))}
            </Panel>
          ))}
        </Collapse>
        {
          // render dialog if needed.
          displayAdding
        }
      </div>
    );
  }
}

export default SideMenu;
