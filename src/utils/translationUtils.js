const statusDisplayType = {
  CREATED: '#8c8c8c',
  READY: 'blue',
  RUNNING: '#2db7f5',
  DONE: '#87d068',
};

const statusDisplayName = {
  CREATED: '未配置',
  READY: '未执行',
  RUNNING: '执行中',
  DONE: '执行完毕',
};

export const status = {
  types: statusDisplayType,
  names: statusDisplayName,
};
