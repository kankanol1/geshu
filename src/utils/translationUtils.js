const statusDisplayType = {
  CREATED: '#8c8c8c',
  READY: 'blue',
  TEMPLATE_DEFINED: '#8c8c8c',
  SOURCES_DEFINED: '#8c8c8c',
  SINK_DEFINED: '#8c8c8c',
  RUNNING: '#2db7f5',
  DONE: '#87d068',
};

const statusDisplayName = {
  CREATED: '未配置',
  READY: '未执行',
  TEMPLATE_DEFINED: '配置中',
  SOURCES_DEFINED: '配置中',
  SINK_DEFINED: '配置中',
  RUNNING: '执行中',
  DONE: '执行完毕',
};

export const status = {
  types: statusDisplayType,
  names: statusDisplayName,
};
