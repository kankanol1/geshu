import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Modal, Icon, message, Card, List, Tooltip } from 'antd';
import request from '../../utils/request';
import urls from '../../utils/urlUtils';
import { extractFileName } from '../../utils/conversionUtils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UploadModal from './UploadModal';
import CreateModal from './CreateModal';
import RenameModal from './RenameModal';
import styles from './StorageList.less';

const data = [
  {
    title: '个人文件',
    icon: 'folder',
    description: '此分类下的所有文件只有个人可见',
    type: 'private',
  },
  {
    title: '公开文件',
    icon: 'folder',
    description: '此分类下的所有文件所有人均可见',
    type: 'public',
  },
  {
    title: '项目文件',
    icon: 'folder',
    description: '此分类下的文件仅有对应项目可见',
    type: 'project',
  },
];

@connect(({ storage, loading }) => ({
  storage,
  loading: loading.models.storage,
}))
export default class StorageList extends PureComponent {
  state = {
    /**
     * value can be following:
     * 1. 'index' => need to show index list.
     * 2. 'project' => need to show all the available projects.
     * 3. 'file' => show file list.
     */
    view: 'file',
    path: '/',
    /**
     * type is used only when view is 'file'.
     * type can be following:
     * 1. 'private' private files.
     * 2. 'public' public files.
     * 3. 'project' project files.
     */
    type: 'private',
    project: {
      id: 0,
      name: '项目',
    },

    /**
     * selected file item, will be used in renameModal and moveModal.
     */
    fileItem: {},
    /** modals */
    uploadModal: false,
    createModal: false,
    renameModal: false,
    // moveModal: false,
  }

  generateTitle = () => {
    const { view, path, type, project } = this.state;
    if (view === 'index') return undefined;
    if (view === 'project') return '当前位置:项目文件首页';
    if (view === 'file') {
      switch (type) {
        case 'private':
          return `当前位置：个人文件(路径:${path})`;
        case 'public':
          return `当前位置：公开文件(路径:${path})`;
        case 'project':
          return `当前位置：项目文件[${project.name}](路径:${path})`;
        default:
          return undefined;
      }
    }
  }

  backOneStep = () => {
    const { path, type, view, project } = this.state;
    if (view === 'file' && path !== '/') {
      // just go to upper state.
      const nameArr = path.split('/');
      const newPath = path.substr(0, path.length - nameArr[nameArr.length - 1].length);
      // fetch again.
      this.props.dispatch({
        type: 'storage/fetchFileListForType',
        payload: {
          id: type === 'project' ? project.id : -1,
          type,
          path: newPath,
        },
        callback: () => this.setState({ path: newPath }),
      });
    } else if (view === 'file' && type === 'project') {
      // just show the project.
      this.setState({ view: 'project', type: undefined });
    } else {
      this.setState({ view: 'index', type: undefined });
    }
  }

  backHome = () => {
    this.setState({
      view: 'index',
      type: undefined,
      path: '/',
    });
  }

  changeView = (type) => {
    switch (type) {
      case 'private':
        this.props.dispatch({
          type: 'storage/fetchFileListForType',
          payload: {
            id: 0,
            type: 'private',
            path: '/',
          },
          callback: () => this.setState({ view: 'file', type: 'private', path: '/' }),
        });
        break;
      case 'public':
        this.props.dispatch({
          type: 'storage/fetchFileListForType',
          payload: {
            id: 0,
            type: 'public',
            path: '/',
          },
          callback: () => this.setState({ view: 'file', type: 'public', path: '/' }),
        });
        break;
      case 'project':
        this.props.dispatch({
          type: 'storage/fetchProjectsForFile',
          callback: () =>
            this.setState({ view: 'project', path: '/' }),
        });
        break;
      default:
        break;
    }
  }

  visitProject = (projectItem) => {
    this.props.dispatch({
      type: 'storage/fetchFileListForType',
      payload: {
        id: projectItem.id,
        type: 'project',
        path: this.state.path,
      },
      callback: () =>
        this.setState({ view: 'file', path: '/', type: 'project', project: projectItem }),
    });
  }

  visitFile = (fileItem) => {
    if (fileItem.rpath === this.state.path) {
      this.backOneStep();
    } else {
      if (!fileItem.isdir) return;
      const { type, project } = this.state;
      this.props.dispatch({
        type: 'storage/fetchFileListForType',
        payload: {
          id: type === 'project' ? project.id : -1,
          type,
          path: fileItem.rpath,
        },
        callback: () =>
          this.setState({ path: fileItem.rpath }),
      });
    }
  }

  deleteFile = (fileItem) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除文件${fileItem.isdir ? '夹' : ''}：${extractFileName(fileItem.path)} 吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // console.log('OK');
      },
    });
  }

  renderIndexList = () => {
    return (
      <List
        dataSource={data}
        loading={this.props.loading}
        renderItem={item => (
          <List.Item>
            <div onClick={() => this.changeView(item.type)} className={styles.indexItems}>
              <div className={styles.listTitle}>
                <Icon type={item.icon} className={styles.indexIcon} />{item.title}
              </div>
              <div><span className={styles.listDesc}>{item.description}</span></div>
            </div>
          </List.Item>
      )}
      />
    );
  }

  renderFileList = () => {
    const { loading, storage } = this.props;
    const { files } = storage;
    return (
      <List
        dataSource={files}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={() => this.visitFile(item)}
              className={styles.indexItems}
            >
              <div className={styles.listTitle}>
                <Icon type={item.isdir ? 'folder' : 'file'} className={styles.indexIcon} />
                <span>{item.rpath === this.state.path ? '..' : extractFileName(item.rpath)}</span>
                {
                  item.rpath === this.state.path ? null :
                  (
                    <div className={styles.opIcons} onClick={e => e.stopPropagation()}>
                      <Tooltip title="删除">
                        <Icon type="delete" onClick={() => this.deleteFile(item)} />
                      </Tooltip>

                      <Tooltip title="重命名">
                        <Icon type="edit" onClick={() => this.setState({ renameModal: true, fileItem: item })} />
                      </Tooltip>
                      {/* <Tooltip title="移动">
                        <Icon type="folder-open"
                         onClick={() => this.setState({ moveModal: true, fileItem: item })} />
                      </Tooltip> */}
                    </div>
                  )
                }
              </div>
            </div>
          </List.Item>
      )}
      />
    );
  }

  renderProjectList = () => {
    const { loading, storage } = this.props;
    const { projects } = storage;
    return (
      <List
        dataSource={projects}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div onClick={() => this.visitProject(item)} className={styles.indexItems}>
              <div className={styles.listTitle}>
                <Icon type="book" className={styles.indexIcon} />{item.name}
              </div>
              <div><span className={styles.listDesc}>{item.description}</span></div>
            </div>
          </List.Item>
      )}
      />
    );
  }

  renderModals() {
    const { renameModal, createModal, uploadModal, type, project, path, view } = this.state;
    const refreshFileList = () => {
      if (view === 'file') {
        this.props.dispatch({
          type: 'storage/fetchFileListForType',
          payload: {
            id: type === 'project' ? project.id : -1,
            type,
            path,
          },
        });
      }
    };
    return (
      <React.Fragment>
        {uploadModal ? (
          <UploadModal
            visible={uploadModal}
            type={type}
            projectId={project ? project.id : -1}
            path={path}
            onCancel={() => this.setState({ uploadModal: false })}
            onOk={() => {
              this.setState({ uploadModal: false });
              // refresh file.
              refreshFileList();
            }
          }
          />
          ) : null
        }
        {
          createModal ? (
            <CreateModal
              visible={createModal}
              type={type}
              projectId={project ? project.id : -1}
              path={path}
              onCancel={() => this.setState({ createModal: false })}
              onOk={() => {
                this.setState({ createModal: false });
                // refresh file.
                refreshFileList();
              }
            }
            />
          ) : null
        }
        {
          renameModal ? (
            <RenameModal
              visible={renameModal}
              type={type}
              projectId={project ? project.id : -1}
              fileItem={this.state.fileItem}
              path={path}
              onCancel={() => this.setState({ renameModal: false })}
              onOk={() => {
                this.setState({ renameModal: false });
                // refresh file.
                refreshFileList();
              }
            }
            />
          ) : null
        }
      </React.Fragment>
    );
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card title={this.generateTitle()}>
          <div className={styles.buttonBar}>
            { this.state.view === 'index' ? null : (
              <React.Fragment>
                <Tooltip title="首页">
                  <Button onClick={() => this.backHome()}>
                    <Icon type="home" />
                  </Button>
                </Tooltip>
                <Tooltip title="返回">
                  <Button onClick={() => this.backOneStep()}><Icon type="rollback" /></Button>
                </Tooltip>
              </React.Fragment>
              )}
            { this.state.view === 'file' ? (
              <React.Fragment>
                <Button type="primary" onClick={() => this.setState({ uploadModal: true })}><Icon type="upload" />上传文件</Button>
                <Button onClick={() => this.setState({ createModal: true })}><Icon type="folder-add" />创建文件夹</Button>
              </React.Fragment>
            ) : null}
          </div>
          <Card className={styles.bodyCard}>
            {this.state.view === 'index' ? this.renderIndexList() : null}
            {this.state.view === 'project' ? this.renderProjectList() : null}
            {this.state.view === 'file' ? this.renderFileList() : null}
          </Card>
          {this.renderModals()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
