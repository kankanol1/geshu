import React, { PureComponent } from 'react';
import { Button, Icon, Card, List, Tooltip, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
// import download from 'downloadjs';
import { extractFileName } from '../../utils/conversionUtils';
import { getDisplayDataForTypes } from './StorageUtils';
import UploadModal from './UploadModal';
import CreateModal from './CreateModal';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';
import MoveModal from './MoveModal'; // eslint-disable-line

import {
  queryFileForType,
  queryRegisteredTypes,
  queryGraphProjectsForFile,
  queryPipelineProjectsForFile,
} from '../../services/storageAPI';
import defaultStyles from './StorageFilePicker.less';
import { humanFileSize } from '../../utils/utils';

const download = url => {
  const f = document.createElement('iframe');
  document.body.appendChild(f);
  f.src = url;
  setTimeout(() => {
    document.body.removeChild(f);
  }, 2333);
};

export default class StorageFilePicker extends React.PureComponent {
  static defaultProps = {
    onChange: undefined,
    styles: defaultStyles,
    enableItemOp: false,
    smallSize: false,
    enableUpload: false,
    enableMkdir: false,
    allowSelectFolder: false,
    folderOnly: false,
    height: undefined,
    mode: 'all',
    view: 'index',
    type: undefined,
    project: {
      id: -1,
      name: '无项目',
    },
    path: '/',
    onFileVisited: undefined,
    pickMode: 'pick',
    createFileName: undefined,
    onCreateChange: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      /**
       * value can be following:
       * 1. 'index' => need to show index list.
       * 2. 'project' => need to show all the available projects.
       * 3. 'file' => show file list.
       */
      view: this.props.view,
      path: this.props.path,
      /**
       * type is used only when view is 'file'.
       * type can be following:
       * 1. 'private' private files.
       * 2. 'public' public files.
       * 3. 'project' project files.
       */
      type: this.props.type,
      project: this.props.project,

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
       * index fetched from remote.
       */
      indexData: [],
      /**
       * loading...
       */
      loading: false,

      // running status
      selectedType: undefined,
      selectedFile: undefined,
      selectedProject: undefined,

      createFileName: undefined,
    };
  }

  componentDidMount() {
    const { view, type, project, path, createFileName } = this.props;
    this.setState({ createFileName });
    if (view === 'index') {
      // init index.
      this.fetchIndex();
    } else if (view === 'file' && type !== undefined) {
      // init for file.
      // fetch
      this.fetchFileListForType({
        payload: {
          projectId: type === 'pipeline' || type === 'graph' ? project.id : -1,
          type,
          path,
        },
      });
    }
  }

  onChange(type, path, project, fullPath) {
    const { onChange } = this.props;
    if (onChange) {
      const selected = {
        type,
        path,
        projectId: project.id,
        projectName: project.name,
        fullPath,
      };
      onChange(selected);
    }
  }

  onCreateChange(type, path, project, fullPath, filename) {
    const { onCreateChange } = this.props;
    if (onCreateChange) {
      const selected = {
        type,
        path,
        projectId: project.id,
        projectName: project.name,
        fullPath,
        filename,
      };
      onCreateChange(selected);
    }
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
        case 'graph':
          return `当前位置：项目文件[${project.name}](路径:${path})`;
        default:
          return undefined;
      }
    }
  };

  backOneStep = () => {
    const { path, type, view, project } = this.state;
    if (view === 'file' && path !== '/') {
      // just go to upper state.
      const nameArr = path.split('/');
      // notice: remove the last '/' as well.

      const newPath =
        nameArr.length === 2
          ? '/'
          : path.substr(0, path.length - nameArr[nameArr.length - 1].length - 1);
      // fetch again.
      this.fetchFileListForType({
        payload: {
          projectId: type === 'graph' || type === 'pipeline' ? project.id : -1,
          type,
          path: newPath,
        },
        newStates: {
          path: newPath,
        },
      });
    } else if (
      view === 'file' &&
      (type === 'graph' || type === 'pipeline') &&
      this.props.mode === 'all'
    ) {
      // just show the project.
      this.setState({ view: 'project' });
    } else {
      this.setState({ view: 'index', type: undefined });
    }
  };

  backHome = () => {
    const { view, type, project, path } = this.props;
    const newStates = {
      view: this.props.view,
      type: this.props.type,
      path: this.props.path,
    };
    if (view === 'file' && type !== undefined) {
      // fetch
      this.fetchFileListForType({
        payload: {
          projectId: type === 'graph' || type === 'pipeline' ? project.id : -1,
          type,
          path,
        },
        newStates,
      });
    } else {
      // set state.
      this.setState(newStates);
    }
  };

  fetchFileListForType = ({ payload, newStates }) => {
    this.setState({ loading: true });
    queryFileForType(payload).then(response => {
      this.setState(
        {
          files: response,
          ...newStates,
          loading: false,
        },
        () => {
          if (this.props.pickMode === 'create') {
            const { type, path, project, fullPath, createFileName } = this.state;
            this.onCreateChange(type, path, project, fullPath, createFileName);
          }
          if (this.props.onFileVisited) {
            const status = {
              type: this.state.type,
              path: this.state.path,
              projectId: this.state.project.id,
              projectName: this.state.project.name,
              fullPath: this.state.fullPath,
            };
            this.props.onFileVisited(status);
          }
        }
      );
    });
  };

  fetchGraphProjectsForFile = ({ newStates }) => {
    this.setState({ loading: true });
    queryGraphProjectsForFile().then(response => {
      this.setState({
        projects: response,
        ...newStates,
        loading: false,
      });
    });
  };

  fetchPipelineProjectsForFile = ({ newStates }) => {
    this.setState({ loading: true });
    queryPipelineProjectsForFile().then(response => {
      this.setState({
        projects: response,
        ...newStates,
        loading: false,
      });
    });
  };

  fetchIndex = () => {
    this.setState({ loading: true });
    queryRegisteredTypes().then(response => {
      const excludeList = [];
      if (this.props.mode === 'project') {
        excludeList.unshift('private');
        if (this.props.type === 'graph') {
          excludeList.unshift('pipeline');
        } else if (this.props.type === 'pipeline') {
          excludeList.unshift('graph');
        }
      }
      const transformed = getDisplayDataForTypes(response, excludeList);
      this.setState({
        indexData: transformed,
        loading: false,
      });
    });
  };

  changeView = type => {
    switch (type) {
      case 'private':
        this.fetchFileListForType({
          payload: {
            projectId: 0,
            type: 'private',
            path: '/',
          },
          newStates: { view: 'file', type: 'private', path: '/', selectedType: undefined },
        });
        break;
      case 'public':
        this.fetchFileListForType({
          payload: {
            projectId: 0,
            type: 'public',
            path: '/',
          },
          newStates: { view: 'file', type: 'public', path: '/', selectedType: undefined },
        });
        break;
      case 'graph':
      case 'pipeline':
        if (this.props.mode === 'all') {
          if (type === 'pipeline') {
            this.fetchPipelineProjectsForFile({
              newStates: { view: 'project', type, path: '/', selectedType: undefined },
            });
          } else {
            this.fetchGraphProjectsForFile({
              newStates: { view: 'project', type, path: '/', selectedType: undefined },
            });
          }
        } else if (this.props.mode === 'project') {
          this.fetchFileListForType({
            payload: {
              projectId: this.props.project.id,
              type: this.props.type,
              path: '/',
            },
            newStates: { view: 'file', type: this.props.type, path: '/', selectedType: undefined },
          });
        }
        break;
      default:
        break;
    }
  };

  visitProject = (projectItem, type) => {
    this.fetchFileListForType({
      payload: {
        projectId: projectItem.id,
        type,
        path: this.state.path,
      },
      newStates: {
        view: 'file',
        path: '/',
        type,
        project: projectItem,
        selectedProject: undefined,
      },
    });
  };

  visitFile = fileItem => {
    if (fileItem.rpath === this.state.path) {
      this.backOneStep();
    } else {
      if (!fileItem.isdir) return;
      const { type, project } = this.state;
      this.fetchFileListForType({
        payload: {
          projectId: type === 'graph' || type === 'pipeline' ? project.id : -1,
          type,
          path: fileItem.rpath,
        },
        newStates: {
          path: fileItem.rpath,
          selectedFile: undefined,
        },
      });
    }
  };

  handleTypeSelect(selectedType) {
    this.setState({ selectedType });
    // onchange.
    this.onChange(selectedType, '/', this.state.project, undefined);
  }

  handleFileSelect(selectedFile) {
    const { folderOnly } = this.props;
    if (selectedFile.isdir || !folderOnly) {
      this.setState({ selectedFile });
      this.onChange(this.state.type, selectedFile.rpath, this.state.project, selectedFile.path);
    }
  }

  handleProjectSelect(selectedProject) {
    this.setState({ selectedProject });
    this.onChange('project', '/', selectedProject, undefined);
  }

  renderIndexList = () => {
    const { styles, allowSelectFolder, mode } = this.props;
    const { loading, selectedType, indexData } = this.state;
    return (
      <List
        dataSource={indexData}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={
                allowSelectFolder &&
                ((item.type !== 'pipeline' && item.type !== 'graph') || mode === 'project')
                  ? e => {
                      e.preventDefault();
                      this.handleTypeSelect(item.type);
                    }
                  : e => {
                      e.preventDefault();
                      this.changeView(item.type);
                    }
              }
              onDoubleClick={e => {
                e.preventDefault();
                if (allowSelectFolder) this.changeView(item.type);
              }}
              className={`${styles.indexItems} ${
                selectedType === item.type ? styles.selectedItem : ''
              }`}
            >
              <div className={styles.listTitle}>
                <Icon type={item.icon} className={styles.indexIcon} />
                {item.title}
              </div>
              <div>
                <span className={styles.listDesc}>{item.description}</span>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  renderFileList = () => {
    const { styles, enableItemOp, allowSelectFolder } = this.props;
    const { files, loading, selectedFile } = this.state;
    const renderItemOp = item => {
      if (item.rpath !== this.state.path) {
        return (
          <div className={styles.opIcons} onClick={e => e.stopPropagation()}>
            <Tooltip title="删除">
              <Icon
                type="delete"
                onClick={() => this.setState({ deleteModal: true, fileItem: item })}
              />
            </Tooltip>

            <Tooltip title="重命名">
              <Icon
                type="edit"
                onClick={() => this.setState({ renameModal: true, fileItem: item })}
              />
            </Tooltip>
            <Tooltip title="移动">
              <Icon
                type="folder-open"
                onClick={() => this.setState({ moveModal: true, fileItem: item })}
              />
            </Tooltip>
            <Tooltip title="下载">
              <Icon
                type="download"
                onClick={() => {
                  const requestUrl = `projectId=${
                    this.state.project ? this.state.project.id : -1
                  }&type=${this.state.type}&path=${item.rpath}`;
                  // TODO save the correct chinese name.
                  // const fileArr = item.rpath.split('/');
                  // const fileName = fileArr[fileArr.length -1];
                  download(`/api/fs/download?${encodeURI(requestUrl)}`);
                }}
              />
            </Tooltip>
          </div>
        );
      }
    };
    let renderItems;
    if (
      this.props.type === this.state.type &&
      this.props.view === this.state.view &&
      this.props.path === this.state.path &&
      this.props.project.id === this.state.project.id
    ) {
      // hide the first item.
      const [, ...rest] = files;
      renderItems = rest;
    } else {
      renderItems = files;
    }
    return (
      <List
        dataSource={renderItems}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={
                allowSelectFolder || !item.isdir
                  ? () => this.handleFileSelect(item)
                  : () => this.visitFile(item)
              }
              onDoubleClick={allowSelectFolder ? () => this.visitFile(item) : null}
              className={`${styles.indexItems} ${
                selectedFile && selectedFile.rpath === item.rpath ? styles.selectedItem : ''
              }`}
            >
              <div className={styles.listTitle}>
                <Icon type={item.isdir ? 'folder' : 'file'} className={styles.indexIcon} />
                <span>{item.rpath === this.state.path ? '..' : extractFileName(item.rpath)}</span>
                {item.rpath === this.state.path || item.isdir ? null : (
                  <span className={styles.listDetail}> {humanFileSize(item.fileSize)} </span>
                )}
                {enableItemOp ? renderItemOp(item) : null}
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  renderProjectList = () => {
    const { loading, projects, selectedProject, type } = this.state;
    const { styles, allowSelectFolder } = this.props;
    return (
      <List
        dataSource={projects}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div
              onClick={
                allowSelectFolder
                  ? e => {
                      e.preventDefault();
                      this.handleProjectSelect(item);
                    }
                  : e => {
                      e.preventDefault();
                      this.visitProject(item, type);
                    }
              }
              onDoubleClick={e => {
                e.preventDefault();
                if (allowSelectFolder) this.visitProject(item, type);
              }}
              className={`${styles.indexItems} ${
                selectedProject && selectedProject.id === item.id ? styles.selectedItem : ''
              }`}
            >
              <div className={styles.listTitle}>
                <Icon type="book" className={styles.indexIcon} />
                {item.name}
              </div>
              <div>
                <span className={styles.listDesc}>{item.description}</span>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  renderModals() {
    const {
      moveModal,
      deleteModal,
      renameModal,
      createModal,
      uploadModal,
      type,
      project,
      path,
      view,
    } = this.state;
    const refreshFileList = () => {
      if (view === 'file') {
        this.fetchFileListForType({
          payload: {
            projectId: type === 'graph' || type === 'pipeline' ? project.id : -1,
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
            }}
          />
        ) : null}
        {createModal ? (
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
            }}
          />
        ) : null}
        {renameModal ? (
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
            }}
          />
        ) : null}
        {deleteModal ? (
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
            }}
          />
        ) : null}
        {moveModal ? (
          <MoveModal
            // set mode & related info to move modal.
            mode={this.props.mode}
            view={this.props.view}
            type={this.props.type}
            folderType={this.props.folderType}
            visible={moveModal}
            // type={type}
            project={project}
            fileItem={this.state.fileItem}
            path={path}
            onCancel={() => this.setState({ moveModal: false })}
            onOk={() => {
              this.setState({ moveModal: false });
              // refresh file.
              refreshFileList();
            }}
          />
        ) : null}
      </React.Fragment>
    );
  }

  renderNavigationButton() {
    if (
      this.state.view !== this.props.view ||
      this.state.type !== this.props.type ||
      this.state.path !== this.props.path ||
      this.state.project.id !== this.props.project.id
    ) {
      return (
        <React.Fragment>
          <Tooltip title="首页">
            <Button onClick={() => this.backHome()}>
              <Icon type="home" />
            </Button>
          </Tooltip>
          <Tooltip title="返回">
            <Button onClick={() => this.backOneStep()}>
              <Icon type="rollback" />
            </Button>
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
                <Button type="primary" onClick={() => this.setState({ uploadModal: true })}>
                  <Icon type="upload" />
                </Button>
              </Tooltip>
            ) : (
              true
            )}
            {enableMkdir ? (
              <Tooltip title="创建文件夹">
                <Button onClick={() => this.setState({ createModal: true })}>
                  <Icon type="folder-add" />
                </Button>
              </Tooltip>
            ) : null}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            {enableUpload ? (
              <Button type="primary" onClick={() => this.setState({ uploadModal: true })}>
                <Icon type="upload" />
                上传文件
              </Button>
            ) : null}
            {enableMkdir ? (
              <Button onClick={() => this.setState({ createModal: true })}>
                <Icon type="folder-add" />
                创建文件夹
              </Button>
            ) : null}
          </React.Fragment>
        );
      }
    }
  }

  render() {
    const { styles, height, pickMode } = this.props;
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
          {height ? <Scrollbars style={{ height }}>{listContent}</Scrollbars> : listContent}
        </Card>

        {pickMode === 'create' && (
          <Input
            placeholder="输入文件名"
            value={this.state.createFileName}
            onChange={e => {
              e.preventDefault();
              this.setState({ createFileName: e.target.value }, () => {
                const { type, path, project, fullPath, createFileName } = this.state;
                this.onCreateChange(type, path, project, fullPath, createFileName);
              });
            }}
          />
        )}

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
  /**
   * the selection mode.
   * all: show all files.(private, all projects, public)
   * project: show only given projects and public
   */
  mode: PropTypes.string,

  /**
   * default view.
   */
  view: PropTypes.string,

  /**
   * default type.
   * 'public', 'private', 'graph', 'pipeline'
   */
  type: PropTypes.string,

  /**
   * path: default path,
   */
  path: PropTypes.string,

  /**
   * default project: {id, name}
   */
  project: PropTypes.object,

  styles: PropTypes.object,

  enableItemOp: PropTypes.bool,

  smallSize: PropTypes.bool,

  enableUpload: PropTypes.bool,

  enableMkdir: PropTypes.bool,

  allowSelectFolder: PropTypes.bool,

  folderOnly: PropTypes.bool,

  height: PropTypes.number,

  /**
   * will be called when visiting new folders.
   */
  onFileVisited: PropTypes.func,

  pickMode: PropTypes.string, // picker mode: 'pick', 'create'

  onCreateChange: PropTypes.func, // callback when create changes.

  createFileName: PropTypes.string,
};
