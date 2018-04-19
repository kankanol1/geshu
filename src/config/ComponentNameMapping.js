const nameMapping = {

  /** component groups and components */
  DataSink: '数据存储',
  ConsoleDataSink: '控制台数据存储',
  FileDataSink: '文件存储',
  ConsoleModelSink: '控制台模型存储',
  Transformer: '数据转换',
  AddLiteralColumnTransformer: '增加列',
  RandomSplitTransformer: 'RandomSplit',
  ColumnFilterTransformer: '按列过滤',
  ColumnRenameTransformer: '重命名列',
  SelectTransformer: '选择',
  Predictor: '预测',
  CommonPredictor: '应用模型预测',
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
  ParquetDataSink: 'Parquet文件存储',
  CollectDataSink: 'Collect文件存储',
  RandomSplit: '随机划分',
  MetricsPredictor: '应用模型预测（带度量）',
  TrainValidationSplitTuner: '交叉验证训练调优',
  JsonDataSource: 'Json文件读取',
  JdbcDataSource: 'Jdbc数据源',
  ParquetDataSource: 'Parquet文件读取',
  FileModelSink: '模型存储',
  LinearRegressionStage: '线性回归',
  HashingTF: 'HashingTF',
  KMeansStage: 'K-Means',
  FileModelSource: '模型读取',


  /* config name mapping */
  ConsoleDataSinkConf: '控制台数据存储配置项',
  AllLiteralColumnTransformerConf: '增加列配置项',
  RandomSplitTransformerConf: 'RandomSplit配置项',
  ColumnFilterTransformerConf: '列过滤配置项',
  ColumnRenameTransformerConf: '列重命名配置项',
  SelectTransformerConf: '选择配置项',
  CommonPredictorConf: '通用预测配置项',
  ConsoleModelSinkConf: '控制台模型存储配置项',
  LogisticRegressionStageConf: '逻辑回归配置项',
  TokenizerStageConf: '分词配置项',
  HashingTFStageConf: 'HashingTF配置项',
  CrossValidationTunerConf: '交叉验证配置项',
  FileDataSourceConf: '文件读取配置项',

};

export default function translateName(name) {
  return nameMapping[name] === undefined ? name : nameMapping[name];
}
