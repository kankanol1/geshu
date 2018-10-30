// define all user privielges.
module.exports = {
  LOGIN_USER: 0, // reserved, will not be returned by backend.
  USER_VIEW: 1, // 查看用户列表
  USER_ADD: 2, // 添加新用户
  USER_MODIFY: 3, // 修改用户状态
  USER_DELETE: 4, // 删除用户
  ROLE_VIEW: 17, // 角色查看
  ROLE_CREATE: 18, // 角色新建
  ROLE_MODIFY: 19, // 角色修改
  ROLE_DELETE: 20, // 角色删除
  TEAM_VIEW: 33, // 组查看
  TEAM_CREATE: 34, // 创建组
  TEAM_MODIFY: 35, // 修改组
  TEAM_DELETE: 36, // 删除组
  SYS_PARAM_MODIFY: 49, // 系统参数修改
  PROJECT_DATAPRO_VIEW: 257, // 数据处理项目查看
  PROJECT_DATAPRO_CREATE: 258, // 数据处理项目创建
  PROJECT_DATAPRO_MODIFY: 259, // 数据处理项目状态修改
  PROJECT_DATAPRO_DELETE: 260, // 数据处理项目删除
  DATASET_VIEW: 273, // 数据集查看
  DATASET_CREATE: 274, // 数据集新建
  DATASET_MODIFY: 275, // 数据集信息修改
  DATASET_DELETE: 276, // 数据集删除
  PROJECT_DATAPRO_PIPELINE_VIEW: 513, // 数据处理项目 工作流查看
  PROJECT_DATAPRO_PIPELINE_MODIFY: 514, // 数据处理项目 工作流修改
  PROJECT_DATAPRO_DATASET_VIEW: 529, // 数据处理项目 数据集查看
  PROJECT_DATAPRO_DATASET_MODIFY: 530, // 数据处理项目 数据集修改
  PROJECT_DATAPRO_DASHBOARD_VIEW: 545, // 数据处理项目 看板查看
  PROJECT_DATAPRO_DASHBOARD_MODIFY: 546, // 数据处理项目 看板修改
  PROJECT_DATAPRO_ADD_USER: 561, // 添加人员
  PROJECT_DATAPRO_PROJECT_MANAGE: 562, // 删除/转移项目
};
