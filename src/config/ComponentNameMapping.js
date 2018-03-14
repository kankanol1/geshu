const nameMapping = {
  DataSink: '数据存储',
  ConsoleDataSink: '控制台数据存储',
  ConsoleModelSink: '控制台模型存储',
  Transformer: '数据转换',
  AddLiteralColumnTransformer: '增加列',
  RandomSplitTransformer: 'RandomSplit',
  ColumnFilterTransformer: '按列过滤',
  ColumnRenameTransformer: '重命名列',
  SelectTransformer: '选择',
  Predictor: '预测',
  CommonPredictor: '通用预测',
  ModelSink: '模型存储',
  Stage: 'Stage',
  LogisticRegressionStage: '逻辑回归',
  TokenizerStage: '分词',
  HashingTFStage: 'HashingTF',
  Tuner: '调优',
  CrossValidationTuner: '交叉验证调优',
  ModelSource: '模型读取',
  DataSource: '数据读取',
  FileDataSource: '文件读取',
};

export default nameMapping;