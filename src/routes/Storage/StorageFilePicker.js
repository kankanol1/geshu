import React, { PureComponent } from 'react';
import { Button, Icon, Card, List, Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import { extractFileName } from '../../utils/conversionUtils';
import { indexListData } from './StorageUtils';
import UploadModal from './UploadModal';
import CreateModal from './CreateModal';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';
import MoveModal from './MoveModal';
import { queryProjectsForFile, queryFileForType } from '../../services/storageAPI';
import defaultStyles from './StorageFilePicker.less';

export default class StorageFilePicker extends PureComponent {
  static defaultProps = {
    onChange: undefined,
    styles: defaultStyles,
    enableItemOp: false,
    smallSize: false,
    enableUpload: false,
    enableMkdir: false,
    allowSelectFolder: false,
    height: undefined,
  }

  state = {
    /**
     * value can be following:
     * 1. 'index' => need to show index list.
     * 2. 'project' => need to show all the available projects.
     * 3. 'file' => show file list.
     */
    view: 'index',
    path: '/',
    /**
     * type is used only when view is 'file'.
     * type can be following:
     * 1. 'private' private files.
     * 2. 'public' public files.
     * 3. 'project' project files.
     */
    type: undefined,
    project: {
      id: 0,
      name: '项目',
    },

    /**
     * selected file item, will be used in renameModal, deleteModal and moveModal.
     */
    fileItem: {},
    /** modals */
    uploadModal: false,
    createModal: false,
    renameModal: false,
    deleteModal: false,
    moveModal: false,

    /**
     * projects fetched from remote.
     */
    projects: [],
    /**
     * files fetched from remote.
     */
    files: [],
    /**
     * loading...
     */
    loading: false,

    // running status
    selectedType: undefined,
    selectedFile: undefined,
    selectedProject: undefined,
  }

  onChange(type, path, project) {
    const selected = {
      type, path, projectId: project.id, projectName: project.name,
    };
    const { onChange } = this.props;
    if (onChange) onChange(selected);
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
      this.fetchFileListForType({
        payload: {
          id: type === 'project' ? project.id : -1,
          type,
          path: newPath,
        },
        newStates: {
          path: newPath,
        },
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

  fetchFileListForType = ({ payload, newStates }) => {
    this.setState({ loading: true });
    queryFileForType(payload).then((response) => {
      this.setState({
        files: response,
        ...newStates,
        loading: false,
      });
    });
  }

  fetchProjectsForFile = ({ newStates }) => {
    this.setState({ loading: true });
    queryProjectsForFile().then((response) => {
      this.setState({
        projects: response,
        ...newStates,
        loading: false,
      });
    });
  }

  changeView = (type) => {
    switch (type) {
      case 'private':
        this.fetchFileListForType({
          payload: {
            id: 0,
            type: 'private',
            path: '/',
          },
          newStates: { view: 'file', type: 'private', path: '/', selectedType: undefined },
        });
        break;
      case 'public':
        this.fetchFileListForType({
          payload: {
            id: 0,
            type: 'public',
            path: '/',
          },
          newStates: { view: 'file', type: 'public', path: '/', selectedType: undefined },
        });
        break;
      case 'project':
        this.fetchProjectsForFile({
          newStates: { view: 'project', path: '/', selectedType: undefined },
        });
        break;
      default:
        break;
    }
  }

  visitProject = (projectItem) => {
    this.fetchFileListForType({
      payload: {
        id: projectItem.id,
        type: 'project',
        path: this.state.path,
      },
      newStates: {
        view: 'file', path: '/', type: 'project', project: projectItem, selectedProject: undefined,
      },
    });
  }

  visitFile = (fileItem) => {
    if (fileItem.rpath === this.state.path) {
      this.backOneStep();
    } else {
      if (!fileItem.isdir) return;
      const { type, project } = this.state;
      this.fetchFileListForType({
        payload: {
          id: type === 'project' ? project.id : -1,
          type,
          path: fileItem.rpath,
        },
        newStates: {
          path: fileItem.rpath,
          selectedFile: undefined,
        },
      });
    }
  }

  handleTypeSelect(selectedType) {
    this.setState({ selectedType });
    // onchange.
    this.onChange(selectedType, '/', this.state.project);
  }

  handleFileSelect(selectedFile) {
    this.setState({ selectedFile });
    this.onChange(this.state.type, selectedFile.rpath, this.state.project);
  }

  handleProjectSelect(selectedProject) {
    this.setState({ selectedProject });
    this.onChange('project', '/', this.state.project);
  }

  renderIndexList = () => {
    const { styles, allowSelectFolder } = this.props;
    const { loading, selectedType } = this.state;
    return (
      <List
        dataSource={indexListData}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={allowSelectFolder && item.type !== 'project' ?
                () => this.handleTypeSelect(item.type) : () => this.changeView(item.type)}
              onDoubleClick={allowSelectFolder ?
                () => this.changeView(item.type) : null
              }
              className={`${styles.indexItems} ${selectedType === item.type ? styles.selectedItem : ''}`}
            >
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
    const { styles, enableItemOp, allowSelectFolder } = this.props;
    const { files, loading, selectedFile } = this.state;
    const renderItemOp = (item) => {
      if (item.rpath !== this.state.path) {
        return (
          <div className={styles.opIcons} onClick={e => e.stopPropagation()}>
            <Tooltip title="删除">
              <Icon type="delete" onClick={() => this.setState({ deleteModal: true, fileItem: item })} />
            </Tooltip>

            <Tooltip title="重命名">
              <Icon type="edit" onClick={() => this.setState({ renameModal: true, fileItem: item })} />
            </Tooltip>
            <Tooltip title="移动">
              <Icon
                type="folder-open"
                onClick={() => this.setState({ moveModal: true, fileItem: item })}
              />
            </Tooltip>
          </div>
        );
      }
    };
    return (
      <List
        dataSource={files}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={allowSelectFolder ?
                () => this.handleFileSelect(item) : () => this.visitFile(item)}
              onDoubleClick={allowSelectFolder ?
                () => this.visitFile(item) : null
              }
              className={`${styles.indexItems} ${selectedFile && selectedFile.rpath === item.rpath ? styles.selectedItem : ''}`}
            >
              <div className={styles.listTitle}>
                <Icon type={item.isdir ? 'folder' : 'file'} className={styles.indexIcon} />
                <span>{item.rpath === this.state.path ? '..' : extractFileName(item.rpath)}</span>
                {
                  enableItemOp ? renderItemOp(item) : null
                }
              </div>
            </div>
          </List.Item>
      )}
      />
    );
  }

  renderProjectList = () => {
    const { loading, projects, selectedProject } = this.state;
    const { styles, allowSelectFolder } = this.props;
    return (
      <List
        dataSource={projects}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={allowSelectFolder ?
                () => this.handleProjectSelect(item) : () => this.visitProject(item)}
              onDoubleClick={allowSelectFolder ?
                () => this.visitProject(item) : null
              }
              className={`${styles.indexItems} ${selectedProject && selectedProject.id === item.id ? styles.selectedItem : ''}`}
            >
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
    const { moveModal, deleteModal, renameModal, createModal,
      uploadModal, type, project, path, view } = this.state;
    const refreshFileList = () => {
      if (view === 'file') {
        this.fetchFileListForType(
          {
            payload: {
              id: type === 'project' ? project.id : -1,
              type,
              path,
            },
          }
        );
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
        {
          deleteModal ? (
            <DeleteModal
              visible={deleteModal}
              type={type}
              projectId={project ? project.id : -1}
              fileItem={this.state.fileItem}
              path={path}
              onCancel={() => this.setState({ deleteModal: false })}
              onOk={() => {
                this.setState({ deleteModal: false });
                // refresh file.
                refreshFileList();
              }
            }
            />
          ) : null
        }
        {
          moveModal ? (
            <MoveModal
              visible={moveModal}
              type={type}
              projectId={project ? project.id : -1}
              fileItem={this.state.fileItem}
              path={path}
              onCancel={() => this.setState({ moveModal: false })}
              onOk={() => {
                this.setState({ moveModal: false });
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

  renderNavigationButton() {
    if (this.state.view !== 'index') {
      return (
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
      );
    }
  }

  renderOperationButton() {
    const { smallSize, enableUpload, enableMkdir } = this.props;
    if (this.state.view === 'file') {
      if (smallSize) {
        return (
          <React.Fragment>
            {enableUpload ? (
              <Tooltip title="上传文件">
                <Button type="primary" onClick={() => this.setState({ uploadModal: true })}><Icon type="upload" /></Button>
              </Tooltip>
            ) : true}
            {
              enableMkdir ? (
                <Tooltip title="创建文件夹">
                  <Button onClick={() => this.setState({ createModal: true })}><Icon type="folder-add" /></Button>
                </Tooltip>
              ) : null
            }
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            {enableUpload ? (
              <Button type="primary" onClick={() => this.setState({ uploadModal: true })}><Icon type="upload" />上传文件</Button>
            ) : null}
            {
              enableMkdir ? (
                <Button onClick={() => this.setState({ createModal: true })}><Icon type="folder-add" />创建文件夹</Button>
              ) : null
            }
          </React.Fragment>
        );
      }
    }
  }

  render() {
    const { styles, height } = this.props;
    const listContent = (
      <React.Fragment>
        {this.state.view === 'index' ? this.renderIndexList() : null}
        {this.state.view === 'project' ? this.renderProjectList() : null}
        {this.state.view === 'file' ? this.renderFileList() : null}
      </React.Fragment>
    );
    return (
      <Card title={this.generateTitle()} className={styles.mainCard}>
        <div className={styles.buttonBar}>
          {this.renderNavigationButton()}
          {this.renderOperationButton()}
        </div>
        <Card className={styles.bodyCard}>
          {
            height ? (
              <Scrollbars style={{ height }}>
                {listContent}
              </Scrollbars>
            ) : listContent
          }
        </Card>
        {this.renderModals()}
      </Card>
    );
  }
}

StorageFilePicker.propTypes = {
  /**
   * on item changed.
   */
  onChange: PropTypes.func,
  // /**
  //  * handle select cancel
  //  */
  // onCancel: PropTypes.func,
  // /**
  //  * handle selected.
  //  */
  // onOk: PropTypes.func,
  // /**
  //  * the selection mode.
  //  * all: show all files.(private, all projects, public)
  //  * project: show only given projects and private, public
  //  */
  // mode: PropTypes.string,

  // /**
  //  * default view.
  //  */
  // view: PropTypes.string,

  // /**
  //  * default type.
  //  */
  // type: PropTypes.string,

  // /**
  //  * path: default path,
  //  */
  // path: PropTypes.string,

  // /**
  //  * default project id,
  //  */
  // projectId: PropTypes.number,

  styles: PropTypes.object,

  enableItemOp: PropTypes.bool,

  smallSize: PropTypes.bool,

  enableUpload: PropTypes.bool,

  enableMkdir: PropTypes.bool,

  allowSelectFolder: PropTypes.bool,

  height: PropTypes.number,
};
