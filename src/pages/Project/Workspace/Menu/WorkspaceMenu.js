import React from 'react';
import { connect } from 'dva';
import { Menu, Spin, Modal, Progress, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import { validatePipeline } from '../../../../services/componentAPI';
import styles from './WorkspaceMenu.less';
import { renderIfInScope } from './Utils';

const { SubMenu } = Menu;

class WorkspaceMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.isMac = navigator.appVersion.indexOf('Mac') !== -1;
  }

  state = {
    validatePipelineModal: {
      visible: false,
      loading: true,
      result: {},
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchRecentProjects',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/unloadRecentProjects',
    });
  }

  handleClick(item, key, keypath) {
    const { type } = item.props;
    const { dispatch } = this.props;
    switch (type) {
      case 'redirect':
        dispatch(routerRedux.push(item.props.address));
        break;
      case 'command':
        switch (key) {
          case 'fullScreen':
            this.toggleFullScreen();
            break;
          case 'validate':
            this.validatePipeline();
            break;
          case 'submit':
            this.runPipeline();
            break;
          case 'undo':
            dispatch({
              type: 'workcanvas/canvasUndo',
            });
            break;
          case 'redo':
            dispatch({
              type: 'workcanvas/canvasRedo',
            });
            break;
          case 'selectAll':
            dispatch({
              type: 'workcanvas/canvasSelectAll',
            });
            break;
          case 'deleteSelection':
            dispatch({
              type: 'workcanvas/canvasDeleteSelected',
            });
            break;
          case 'save':
            dispatch({
              type: 'workcanvas/saveProject',
              payload: {
                showMessage: true,
              },
            });
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  toggleFullScreen() {
    const { dispatch, global } = this.props;
    dispatch({
      type: 'global/changeFullScreen',
      payload: !global.fullScreen,
    });
  }

  runPipeline() {
    this.props.dispatch({
      type: 'pipeline_submit/submitPipeline',
      payload: {
        id: this.props.match.params.id,
      },
    });
  }

  validatePipeline() {
    const { match } = this.props;
    this.setState({
      validatePipelineModal: {
        visible: true,
        loading: true,
      },
    });
    const result = validatePipeline({
      id: match.params.id,
    });
    result.then(a =>
      this.setState({
        validatePipelineModal: {
          ...this.state.validatePipelineModal,
          loading: false,
          result: a,
        },
      })
    );
  }

  handleValidatePipelineModalClose() {
    this.setState({
      validatePipelineModal: {
        ...this.state.validatePipelineModal,
        visible: false,
      },
    });
  }

  renderRecentProjects() {
    const { loading, project, global } = this.props;
    const { recentProjects } = project;
    if (loading.models.project) {
      return (
        <Menu.Item key="loading">
          <Spin />
        </Menu.Item>
      );
    }
    return recentProjects.data.map(item => (
      <Menu.Item key={item.id} type="redirect" address={`/project/workspace/editor/${item.id}`}>
        {item.name}
      </Menu.Item>
    ));
  }

  renderValidateModal() {
    const { loading, visible, result } = this.state.validatePipelineModal;
    return (
      <Modal
        title={loading ? '验证中' : '验证完毕'}
        visible={visible}
        cancelText="关闭"
        footer={
          loading ? null : (
            <Button type="primary" onClick={() => this.handleValidatePipelineModalClose()}>
              关闭
            </Button>
          )
        }
        style={{ textAlign: 'center' }}
      >
        {loading ? (
          <Spin size="large" />
        ) : result.success ? (
          <div>
            <Progress type="circle" percent={100} width={40} style={{ marginRight: '20px' }} />
            <span>{result.message}</span>
          </div>
        ) : (
          <div>
            <Progress
              type="circle"
              percent={100}
              width={40}
              status="exception"
              style={{ marginRight: '20px' }}
            />
            <span>验证失败: {result.message}</span>
          </div>
        )}
      </Modal>
    );
  }

  renderShortcut(windows, mac) {
    if (!mac) return windows;
    return this.isMac ? mac : windows;
  }

  renderModals() {
    return <React.Fragment>{this.renderValidateModal()}</React.Fragment>;
  }

  render() {
    const {
      env,
      global,
      workcanvas: { canvas, state },
    } = this.props;
    const { fullScreen } = global;
    const isProjectDirty = state.dirty;
    return (
      <React.Fragment>
        <Menu
          onClick={({ item, key, keypath }) => this.handleClick(item, key, keypath)}
          selectedKeys={fullScreen ? ['fullScreen'] : []}
          mode="horizontal"
          className={styles.workspaceMenu}
        >
          <SubMenu
            title={
              <span>
                <Icon type="folder" />
                项目
              </span>
            }
          >
            <Menu.Item key="open">打开</Menu.Item>
            <Menu.Item key="close" type="redirect" address="/project/workspace/index">
              关闭
            </Menu.Item>
            <SubMenu title={<span>最近打开的项目</span>}>{this.renderRecentProjects()}</SubMenu>
          </SubMenu>
          {renderIfInScope(
            <SubMenu
              scope="editor"
              env={env}
              title={
                <span>
                  <Icon type="cloud-upload-o" />
                  部署
                </span>
              }
            >
              <Menu.Item key="submit" type="command">
                提交运行
              </Menu.Item>
            </SubMenu>,
            'editor',
            env
          )}
          {renderIfInScope(
            <SubMenu
              scope="editor"
              env={env}
              title={
                <span>
                  {' '}
                  <Icon type="edit" />
                  编辑
                </span>
              }
            >
              <Menu.Item key="save" disabled={!isProjectDirty} type="command">
                保存 ({this.renderShortcut('Ctrl+s', '⌘+s')})
              </Menu.Item>
              <Menu.Item key="undo" disabled={canvas && !canvas.canUndo()} type="command">
                撤销 ({this.renderShortcut('Ctrl+z', '⌘+z')})
              </Menu.Item>
              <Menu.Item key="redo" disabled={canvas && !canvas.canRedo()} type="command">
                重做 ({this.renderShortcut('Ctrl+y', '⌘+y')})
              </Menu.Item>
              <Menu.Item key="selectAll" type="command">
                全选 ({this.renderShortcut('Ctrl+a', '⌘+a')})
              </Menu.Item>
              <Menu.Item key="deleteSelection" type="command">
                删除所选项 ({this.renderShortcut('Delete')})
              </Menu.Item>
            </SubMenu>,
            'editor',
            env
          )}
          {renderIfInScope(
            <SubMenu
              scope="editor"
              env={env}
              title={
                <span>
                  <Icon type="eye-o" />
                  显示
                </span>
              }
            >
              <Menu.Item key="fullScreen" type="command">
                {fullScreen ? '√ ' : null}
                全屏
              </Menu.Item>
            </SubMenu>,
            'editor',
            env
          )}
          {renderIfInScope(
            <SubMenu
              scope="editor"
              env={env}
              title={
                <span>
                  <Icon type="code-o" />
                  调试
                </span>
              }
            >
              <Menu.Item scope="editor" env={env} key="validate" type="command">
                验证
              </Menu.Item>
              {/* <Menu.Item key="sampledata" >取样执行</Menu.Item>
              <Menu.Item key="samplepipeline">执行至指定组件</Menu.Item> */}
            </SubMenu>,
            'editor',
            env
          )}
          <Menu.Item key="help">
            <a>
              <Icon type="question-circle-o" />
              帮助
            </a>
          </Menu.Item>
        </Menu>
        {this.renderModals()}
      </React.Fragment>
    );
  }
}

export default connect(({ project, loading, global, workcanvas }) => ({
  project,
  loading,
  global,
  workcanvas,
}))(WorkspaceMenu);
