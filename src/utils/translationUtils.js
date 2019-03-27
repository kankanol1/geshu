const statusDisplayType = {
  CREATED: '#8c8c8c',
  READY: 'blue',
  TEMPLATE_DEFINED: '#8c8c8c',
  SOURCES_DEFINED: '#8c8c8c',
  SINKS_DEFINED: '#8c8c8c',
  RUNNING: '#2db7f5',
  FINISHED: '#87d068',
  SUBMITTED: '#8c8c8c',
  FAILED: 'red',
  SUBMIT_FAILED: 'red',
};

const statusDisplayName = {
  CREATED: '未配置',
  READY: '配置完毕',
  TEMPLATE_DEFINED: '配置中',
  SOURCES_DEFINED: '配置中',
  SINKS_DEFINED: '配置中',
  RUNNING: '执行中',
  FINISHED: '执行完毕',
  SUBMITTED: '提交中',
  SUBMIT_FAILED: '提交出错',
  FAILED: '执行失败',
};

export const status = {
  types: statusDisplayType,
  names: statusDisplayName,
};
