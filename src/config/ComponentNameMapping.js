const nameMapping = {

  Stage: '机器学习B',
  PStage: '机器学习A',

  /** component groups and components */
  DataSink: '数据存储',
  ConsoleDataSink: '数据存储',
  FileDataSink: '文件存储',
  ConsoleModelSink: '模型存储(c)',
  Transformer: '数据转换',
  AddLiteralColumnTransformer: '增加列',
  RandomSplitTransformer: '随机分割',
  ColumnFilterTransformer: '按列过滤',
  ColumnRenameTransformer: '重命名列',
  SelectTransformer: '选择',
  Predictor: '预测',
  CommonPredictor: '应用模型预测',
  ModelSink: '模型存储',
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
  HiveDataSink: 'Hive存储',
  RandomSplit: '随机划分',
  MetricsPredictor: '应用模型预测（带度量）',
  TrainValidationSplitTuner: '交叉验证训练调优',
  JsonDataSource: 'JSON文件读取',
  JdbcDataSource: 'JDBC数据源',
  ParquetDataSource: 'Parquet文件读取',
  AvroDataSource: 'Avro数据读取',
  FileModelSink: '模型存储',
  LinearRegressionStage: '线性回归',
  HashingTF: 'HashingTF',
  KMeansStage: 'K-Means',
  FileModelSource: '模型读取',
  UnionTransformer: '并',
  ColumnSplitTransformer: '列拆分',
  FilterTransformer: '过滤',
  ProjectTransformer: '选择列',
  ColumnValueInTransformer: '补空值',
  JoinTransformer: 'Join',
  TypeConversionTransformer: '列转换',
  DropDuplicatesTransformer: '去重',
  DecisionTreeClassifierPStage: '决策树分类',
  SupportVectorMachineClassifierStage: 'SVM分类',
  NaiveBayesClassifierStage: '朴素贝叶斯分类',
  RandomForestClassifierPStage: '随机森林分类',
  GradientBoostedTreeClassifierPStage: '梯度提升树分类',
  MultilayerPerceptronClassifierStage: '多层感知机分类',
  GradientBoostedTreeRegressorPStage: '梯度提升树回归',
  DecisionTreeRegressorPStage: '决策树回归',
  RandomForestRegressorPStage: '随机森林回归',
  OneHotEncoderPStage: '独热编码',
  StringIndexerPStage: '字符串-索引变换',
  VectorAssemblerPStage: '向量组装',
  BucketizerPStage: '离散化',
  ImputerPStage: '补空值',
  AggregateTransformer: '聚集函数',
  SwitchCaseTransformer: '条件函数',


  /* config name mapping */
  ConsoleDataSinkConf: '控制台数据存储配置',
  AllLiteralColumnTransformerConf: '增加列配置',
  RandomSplitTransformerConf: '随机分割配置',
  ColumnFilterTransformerConf: '列过滤配置',
  ColumnRenameTransformerConf: '列重命名配置',
  SelectTransformerConf: '选择配置',
  CommonPredictorConf: '通用预测配置',
  ConsoleModelSinkConf: '控制台模型存储配置',
  LogisticRegressionStageConf: '逻辑回归配置',
  TokenizerStageConf: '分词配置',
  HashingTFStageConf: 'HashingTF配置',
  CrossValidationTunerConf: '交叉验证配置',
  FileDataSourceConf: '文件读取配置',

  // new added.
  CollectDataSinkConf: '控制台存储配置',
  FileDataSinkConf: '文件存储配置',
  ParquetDataSinkConf: 'Parquet文件存储配置',
  HiveDataSinkConf: 'Hive存储配置',
  UnionTransformerConf: '集合并配置',
  ColumnSplitTransformerConf: '列拆分配置',
  FilterTransformerConf: '过滤配置',
  ProjectTransformerConf: '选择列配置',
  ColumnValueInTransformerConf: '补空值配置',
  JoinTransformerConf: 'Join配置',
  TypeConversionTransformerConf: '列转换配置',
  DropDuplicatesTransformerConf: '去重配置',
  MetricsPredictorConf: '应用模型配置(带预测)',
  DecisionTreeClassifierPStageConf: '决策树分类配置',
  OneHotEncoderPStageConf: '独热编码配置',
  StringIndexerPStageConf: '字符串-索引转换配置',
  GradientBoostedTreeRegressorPStageConf: '梯度提升树回归配置',
  RandomForestClassifierPStageConf: '随机森林分类配置',
  DecisionTreeRegressorPStageConf: '决策树回归配置',
  GradientBoostedTreeClassifierPStageConf: '梯度提升树分类配置',
  RandomForestRegressorPStageConf: '随机森林回归配置',
  SupportVectorMachineClassifierStageConf: 'SVM分类配置',
  LinearRegressionStageConf: '线性回归配置',
  NaiveBayesStageStageConf: '朴素贝叶斯分类配置',
  MultilayerPerceptronClassifierStageConf: '多层感知机分类配置',
  KMeansStageConf: 'K-Means配置',
  VectorAssemblerPStageConf: '向量组装配置',
  TrainValidationSplitTunerConf: '交叉验证训练调优配置',
  FileModelSourceConf: '模型存储配置',
  ParquetDataSourceConf: 'Parquet文件读取',
  JsonDataSourceConf: 'JSON文件读取',
  JdbcDataSourceConf: 'JDBC文件读取',
  AvroDataSourceConf: 'Avor文件读取',
  BucketizerPStageConf: '离散化配置',
  ImputerPStageConf: '补空值配置',
  AggregateTransformerConf: '聚集函数配置',
  SwitchCaseTransformerConf: '条件函数配置',
};

export default function translateName(name) {
  return nameMapping[name] === undefined ? name : nameMapping[name];
}
