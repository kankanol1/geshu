import React from 'react';
import { connect } from 'dva';
import { Menu, Spin, Modal, Progress, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import ScopeMenuItem from './ScopeMenuItem';
import { runPipeline, validatePipeline } from '../../../../services/componentAPI';
import styles from './WorkspaceMenu.less';

const { SubMenu } = Menu;

const OpMenuItem = (props) => {
  const { op, ...rest } = props;
  return <Menu.Item {...rest}>{props.children}</Menu.Item>;
};

@connect(
  ({ project, loading, global }) => ({ project, loading, global })
)
export default class WorkspaceMenu extends React.PureComponent {
  state = {
    runPipelineModal: {
      visible: false,
      loading: true,
      result: {},
    },
    validatePipelineModal: {
      visible: false,
      loading: true,
      result: {},
    },

  }
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
        item.props.op();
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
    const { match } = this.props;
    this.setState({ runPipelineModal: {
      ...this.state.runPipelineModal, visible: true, loading: true,
    } });
    const result = runPipeline({
      id: match.params.id,
    });
    result.then(a =>
      this.setState({ runPipelineModal: {
        ...this.state.runPipelineModal, loading: false, result: a,
      } }));
  }

  validatePipeline() {
    const { match } = this.props;
    this.setState({ validatePipelineModal: {
      ...this.state.validatePipelineModal, visible: true, loading: true,
    } });
    const result = validatePipeline({
      id: match.params.id,
    });
    result.then(a =>
      this.setState({ validatePipelineModal: {
        ...this.state.validatePipelineModal, loading: false, result: a,
      } }));
  }

  handleSubmitPipelineModalOk() {
    this.setState({ runPipelineModal: { ...this.state.runPipelineModal, visible: false } });
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/jobs/list'));
  }

  handleSubmitPipelineModalCancel() {
    this.setState({ runPipelineModal: { ...this.state.runPipelineModal, visible: false } });
  }

  handleValidatePipelineModalClose() {
    this.setState({ validatePipelineModal: {
      ...this.state.validatePipelineModal, visible: false } });
  }

  renderRecentProjects() {
    const { loading, project, global } = this.props;
    const { recentProjects } = project;
    if (loading.models.project) {
      return <Menu.Item key="loading"><Spin /></Menu.Item>;
    }
    return (
      recentProjects.data.map(item => (
        <Menu.Item key={item.id} type="redirect" address={`/project/workspace/editor/${item.id}`}>
          {item.name}
        </Menu.Item>
      ))
    );
  }

  renderSubmitModal() {
    const { loading, visible, result } = this.state.runPipelineModal;
    return (
      <Modal
        title={loading ? '提交中' : '提交完毕'}
        visible={visible}
        okText="跳转至作业管理"
        cancelText="知道了"
        footer={loading ? null : undefined}
        onOk={() => this.handleSubmitPipelineModalOk()}
        onCancel={() => this.handleSubmitPipelineModalCancel()}
        style={{ textAlign: 'center' }}
      >
        {
          loading ?
            <Spin size="large" />
          :
            (result.success ? (
              <div>
                <Progress type="circle" percent={100} width={40} style={{ marginRight: '20px' }} />
                <span>作业ID: {result.jobId}</span>
              </div>
            ) : (
              <div>
                <Progress type="circle" percent={100} width={40} status="exception" style={{ marginRight: '20px' }} />
                <span>错误信息: {result.message}</span>
              </div>
            ))
        }
      </Modal>
    );
  }

  renderValidateModal() {
    const { loading, visible, result } = this.state.validatePipelineModal;
    return (
      <Modal
        title={loading ? '验证中' : '验证完毕'}
        visible={visible}
        cancelText="关闭"
        footer={loading ? null :
        <Button type="primary" onClick={() => this.handleValidatePipelineModalClose()} >关闭</Button>}
        style={{ textAlign: 'center' }}
      >
        {
          loading ?
            <Spin size="large" />
          :
            (result.success ? (
              <div>
                <Progress type="circle" percent={100} width={40} style={{ marginRight: '20px' }} />
                <span>{result.message}</span>
              </div>
            ) : (
              <div>
                <Progress type="circle" percent={100} width={40} status="exception" style={{ marginRight: '20px' }} />
                <span>验证失败: {result.message}</span>
              </div>
            ))
        }
      </Modal>
    );
  }

  renderModals() {
    return (
      <React.Fragment>
        {this.renderSubmitModal()}
        {this.renderValidateModal()}
      </React.Fragment>
    );
  }

  render() {
    const { env, global } = this.props;
    const { fullScreen } = global;
    return (
      <React.Fragment>
        <Menu
          onClick={({ item, key, keypath }) => this.handleClick(item, key, keypath)}
          selectedKeys={fullScreen ? ['fullScreen'] : []}
          mode="horizontal"
          className={styles.workspaceMenu}
        >
          <SubMenu title={<span><Icon type="folder" />项目</span>}>
            <Menu.Item key="open">打开</Menu.Item>
            <Menu.Item key="close" type="redirect" address="/project/workspace/index">关闭</Menu.Item>
            <SubMenu title={<span>最近打开的项目</span>}>
              {this.renderRecentProjects()}
            </SubMenu>
          </SubMenu>
          <SubMenu title={<span><Icon type="eye-o" />显示</span>}>
            <OpMenuItem key="fullScreen" type="command" op={() => this.toggleFullScreen()} >{fullScreen ? '√ ' : null}全屏</OpMenuItem>
          </SubMenu>
          <SubMenu title={<span><Icon type="code-o" />调试</span>}>
            <OpMenuItem scope="editor" env={env} key="validate" type="command" op={() => this.validatePipeline()} >验证</OpMenuItem>
            <Menu.Item key="sampledata" >取样执行</Menu.Item>
            <Menu.Item key="samplepipeline">执行至指定组件</Menu.Item>
          </SubMenu>
          <SubMenu title={<span><Icon type="cloud-upload-o" />部署</span>}>
            <OpMenuItem key="submit" type="command" op={() => this.runPipeline()}>提交运行</OpMenuItem>
          </SubMenu>
          <Menu.Item key="help">
            <a><Icon type="question-circle-o" />帮助</a>
          </Menu.Item>
        </Menu>
        { this.renderModals() }
      </React.Fragment>
    );
  }
}
